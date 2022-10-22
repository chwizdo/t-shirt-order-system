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
import moment from "moment";
import { withModelUtil } from "../../services/ModelUtil";

const Form = ({ firebase, modelUtil }) => {
  const { orderId: paramOrderId } = useParams();
  const history = useHistory();
  const isUpdate = !!paramOrderId;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [selections, setSelections] = useState({});
  const [orderId, setOrderId] = useState(paramOrderId);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    console.log({ ...order });
  }, [order]);

  const getInitialData = async () => {
    const selections = {};
    selections["customers"] = await firebase.getChoices("customers");
    selections["designers"] = await firebase.getChoices("designers");
    selections["sizes"] = await firebase.getChoices("sizes");
    selections["materials"] = await firebase.getChoices("materials");
    selections["status"] = await firebase.getChoices("status");
    selections["sleeves"] = await firebase.getChoices("sleeves");
    selections["collars"] = await firebase.getChoices("collars");
    setSelections(selections);
    if (orderId) {
      setOrder(await firebase.getOrder(orderId));
    } else {
      const orderId = firebase.generateDocId();
      setOrderId(orderId);
      setOrder(await createEmptyOrder(orderId, selections));
    }
    setIsLoading(false);
  };

  const createEmptyOrder = async (orderId, selections) => {
    const latestId = await firebase.getLatestOrderId();
    let newId = moment(new Date()).format("YYMMDD");
    if (latestId.startsWith(newId)) {
      const count = latestId.split(newId)[1];
      const newCount = parseInt(count) + 1;
      newId += newCount;
    } else {
      newId += "1";
    }
    return {
      [orderId]: {
        customer: {
          [Object.keys(selections.customers)[0]]: Object.values(
            selections.customers
          )[0],
        },
        date: new Date(),
        design: "",
        designer: {
          [Object.keys(selections.designers)[0]]: Object.values(
            selections.designers
          )[0],
        },
        id: newId,
        material: {
          [Object.keys(selections.materials)[0]]: Object.values(
            selections.materials
          )[0],
        },
        remark: "",
        status: {
          [Object.keys(selections.status)[0]]: Object.values(
            selections.status
          )[0],
        },
        variations: {},
      },
    };
  };

  const validate = (order, orderId) => {
    // validate design
    if (!order[orderId].design) return "Invalid design name";
    // validate print quantity
    const variations = { ...order[orderId].variations };
    for (const vId in variations) {
      const sizes = { ...variations[vId].sizes };
      for (const sId in sizes) {
        const prints = { ...sizes[sId].prints };
        for (const pId in prints) {
          if (isNaN(parseInt(prints[pId].quantity))) return "Invalid quantity";
        }
      }
    }
    // validate date
    if (!order[orderId].date) return "Invalid date";
    return null;
  };

  const onSubmit = async () => {
    console.log(order);
    setError(null);
    const error = validate(order, orderId);
    if (error) return setError(error);
    try {
      await firebase.createOrder(order);
      history.push(`/${orderId}`);
    } catch (e) {
      console.log(e);
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
              />
            </div>
            {isUpdate && (
              <IconButton theme="error" Icon={TrashIcon} onClick={() => {}} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withModelUtil(withFirebase(Form));
