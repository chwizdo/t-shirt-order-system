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
      const customerId = Object.keys(selections.customers)[0];
      const designerId = Object.keys(selections.designers)[0];
      const materialId = Object.keys(selections.materials)[0];
      const statusId = Object.keys(selections.status)[0];
      const emptyOrder = await modelUtil.getEmptyOrder(
        { [customerId]: selections.customers[customerId] },
        { [designerId]: selections.designers[designerId] },
        { [materialId]: selections.materials[materialId] },
        { [statusId]: selections.status[statusId] }
      );
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
    // validate design.
    const design = modelUtil.getTreeInfo(order, "design");
    if (!design) return "Invalid design name";

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
      await firebase.setOrder(order);
      setIsSubmitting(false);
      history.push(`/${orderId}`);
    } catch (e) {
      setIsSubmitting(false);
      setError("Unknown error");
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
          {modelUtil.getTreeInfo(order, "id")}
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
