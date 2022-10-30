import Header from "../../components/Header";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Link, useHistory, useParams } from "react-router-dom";
import TextButton from "../../components/TextButton";
import { useEffect, useState } from "react";
import { withFirebase } from "../../services/Firebase";
import FormVariation from "./FormVariation";
import FormDetail from "./FormDetail";
import MessageBox from "../../components/MessageBox";
import IconButton from "../../components/IconButton";
import { withModelUtil } from "../../services/ModelUtil";

const Form = ({ firebase, modelUtil }) => {
  const { orderId } = useParams();
  const history = useHistory();
  const isUpdate = !!orderId;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [selections, setSelections] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    console.log({ ...order });
  }, [order]);

  const getInitialData = async () => {
    const selections = await getSelections();
    setSelections(selections);
    if (orderId) {
      setOrder(await firebase.getOrder(orderId));
    } else {
      const statusId = Object.keys(selections.status)[0];
      const emptyOrder = await modelUtil.getEmptyOrder(null, null, null, {
        [statusId]: selections.status[statusId],
      });
      setOrder(emptyOrder);
    }
    setIsLoading(false);
  };

  const getSelections = async () => {
    const selections = {};
    selections["customers"] = await firebase.getChoices("customers");
    selections["designers"] = await firebase.getChoices("designers");
    selections["sizes"] = await firebase.getChoices("sizes");
    selections["materials"] = await firebase.getChoices("materials");
    selections["status"] = await firebase.getChoices("status");
    selections["sleeves"] = await firebase.getChoices("sleeves");
    selections["collars"] = await firebase.getChoices("collars");
    return selections;
  };

  const validate = (order) => {
    // validate customer.
    const customer = modelUtil.getTreeInfo(order, "customer");
    if (!customer) return "Customer field is empty";

    // validate designer.
    const designer = modelUtil.getTreeInfo(order, "designer");
    if (!designer) return "Designer field is empty";

    // validate material.
    const material = modelUtil.getTreeInfo(order, "material");
    if (!material) return "Material field is empty";

    // validate design.
    const design = modelUtil.getTreeInfo(order, "design");
    if (!design) return "Invalid design name";

    // validate image.
    const image = modelUtil.getTreeInfo(order, "image");
    if (!image) return "Image field is empty";

    // validate date.
    const date = modelUtil.getTreeInfo(order, "date");
    if (!date) return "Invalid date";

    // validate print quantity.
    const variationTrees = modelUtil.getTreeInfo(order, "variations");
    for (const vId in variationTrees) {
      const sizeTrees = modelUtil.getTreeInfo(variationTrees[vId], "sizes");
      for (const sId in sizeTrees) {
        const printTrees = modelUtil.getTreeInfo(sizeTrees[sId], "prints");
        for (const pId in printTrees) {
          const quantity = modelUtil.getTreeInfo(printTrees[pId], "quantity");
          if (isNaN(parseInt(quantity))) return "Invalid quantity";
        }
      }
    }

    // If all validations are passed.
    return null;
  };

  const onSubmit = async () => {
    setError(null);
    const error = validate(order);
    if (error) return setError(error);
    try {
      const orderId = modelUtil.getTreeId(order);
      setIsSubmitting(true);

      await createChoiceIfAbsent(order, selections, "customer");
      await createChoiceIfAbsent(order, selections, "designer");
      await createChoiceIfAbsent(order, selections, "material");

      await firebase.setOrder(order);
      setIsSubmitting(false);
      history.push(`/${orderId}`);
    } catch (e) {
      console.log(e);
      setIsSubmitting(false);
      setError("Unknown error");
    }
  };

  const createChoiceIfAbsent = async (order, selections, choice) => {
    const selectionChoice = `${choice}s`;
    const choiceId = modelUtil.getTreeId(modelUtil.getTreeInfo(order, choice));
    if (!selections[selectionChoice][choiceId]) {
      const docId = firebase.generateDocId();
      await firebase.createChoice(selectionChoice, docId, choiceId);
      const o = modelUtil.updateTreeInfo(order, choice, {
        [docId]: { name: choiceId },
      });
      const selectionsCopy = { ...selections };
      selectionsCopy[selectionChoice][docId] = { name: choiceId };
      setSelections(selectionsCopy);
      setOrder(o);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4">
        <Link to="/" className="flex space-x-2 mb-12">
          <ChevronLeftIcon className="w-5 h-5 text-black" />
          <span className="leading-tight underline">Back to Homepage</span>
        </Link>
        <div className="text-xl leading-tight mb-12">
          ORDER ID: {modelUtil.getTreeId(order)}
        </div>
        <FormDetail order={order} setOrder={setOrder} selections={selections} />
        <FormVariation
          order={order}
          setOrder={setOrder}
          selections={selections}
        />
        <div className="space-y-4">
          {error && <MessageBox message={`Error: ${error}`} type="error" />}
          <div className="flex-1 flex space-x-4">
            <div className="flex-1">
              <TextButton theme="light" text="Preview PDF" />
            </div>
            <div className="flex-1">
              <TextButton
                theme="dark"
                text={isUpdate ? "Update Order" : "Create Order"}
                onClicked={onSubmit}
                isLoading={isSubmitting}
              />
            </div>
            {isUpdate && <IconButton theme="error" Icon={TrashIcon} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withModelUtil(withFirebase(Form));
