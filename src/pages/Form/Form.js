import Header from "../../components/Header";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import TextButton from "../../components/TextButton";
import { useEffect, useState } from "react";
import { withFirebase } from "../../services/Firebase";
import FormVariation from "./FormVariation";
import FormDetail from "./FormDetail";

const Form = ({ firebase }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [selections, setSelections] = useState({});

  const { orderId } = useParams();

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    console.log({ ...order });
  }, [order]);

  const getInitialData = async () => {
    const selections = {};
    selections["customers"] = await firebase.getChoices("customers");
    selections["sizes"] = await firebase.getChoices("sizes");
    selections["materials"] = await firebase.getChoices("materials");
    selections["status"] = await firebase.getChoices("status");
    selections["sleeves"] = await firebase.getChoices("sleeves");
    selections["collars"] = await firebase.getChoices("collars");
    setSelections(selections);
    setOrder(await firebase.getOrder(orderId));
    setIsLoading(false);
  };

  const getOrderDetail = (key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId][key];
  };

  const updateOrderDetail = (key, value) => {
    const tempOrder = { ...order };
    tempOrder[orderId][key] = value;
    setOrder(tempOrder);
  };

  const createVariation = () => {
    const variationId = firebase.generateDocId();
    const sizeId = firebase.generateDocId();
    const printId = firebase.generateDocId();
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId] = createEmptyVariation(
      sizeId,
      printId,
      Object.keys(selections.sizes)[0]
    );
    setOrder(tempOrder);
  };

  const getVariationDetail = (variationId, key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId].variations[variationId][key];
  };

  const updateVariationDetail = (variationId, key, value) => {
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId][key] = value;
    setOrder(tempOrder);
  };

  const removeVariation = (variationId) => {
    const tempOrder = { ...order };
    delete tempOrder[orderId].variations[variationId];
    setOrder(tempOrder);
  };

  const createSize = (variationId, selectedSizeId) => {
    const sizeId = firebase.generateDocId();
    const printId = firebase.generateDocId();
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId].sizes[sizeId] = createEmptySize(
      printId,
      selectedSizeId
    );
    setOrder(tempOrder);
  };

  const getSizeDetail = (variationId, sizeId, key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId].variations[variationId].sizes[sizeId][key];
  };

  const createPrint = (variationId, sizeId) => {
    const printId = firebase.generateDocId();
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId].sizes[sizeId].prints[printId] =
      createEmptyPrint();
    setOrder(tempOrder);
  };

  const getPrintDetail = (variationId, sizeId, printId, key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId].variations[variationId].sizes[sizeId].prints[
      printId
    ][key];
  };

  const updatePrintDetail = (variationId, sizeId, printId, key, value) => {
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId].sizes[sizeId].prints[printId][
      key
    ] = value;
    setOrder(tempOrder);
  };

  const removePrint = (variationId, sizeId, printId) => {
    const tempOrder = { ...order };
    if (Object.keys(getSizeDetail(variationId, sizeId, "prints")).length <= 1) {
      delete tempOrder[orderId].variations[variationId].sizes[sizeId];
    } else {
      delete tempOrder[orderId].variations[variationId].sizes[sizeId].prints[
        printId
      ];
    }
    setOrder(tempOrder);
  };

  const createEmptyPrint = () => ({
    name: "",
    number: "",
    quantity: "",
  });

  const createEmptySize = (printId, sizeId) => ({
    size: { [sizeId]: selections.sizes[sizeId] },
    prints: { [printId]: createEmptyPrint() },
  });

  const createEmptyVariation = (sizeId, printId, selectedSizeId) => ({
    collar: {
      [Object.keys(selections.collars)[0]]: Object.values(
        selections.collars
      )[0],
    },
    color: "#FF0000",
    sleeve: {
      [Object.keys(selections.sleeves)[0]]: Object.values(
        selections.sleeves
      )[0],
    },
    sizes: { [sizeId]: createEmptySize(printId, selectedSizeId) },
  });

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
        <div className="text-xl leading-tight mb-12">O220916A</div>
        <FormDetail
          selections={selections}
          getOrderDetail={getOrderDetail}
          updateOrderDetail={updateOrderDetail}
        />
        <FormVariation
          selections={selections}
          getOrderDetail={getOrderDetail}
          createVariation={createVariation}
          getVariationDetail={getVariationDetail}
          updateVariationDetail={updateVariationDetail}
          removeVariation={removeVariation}
          createSize={createSize}
          getSizeDetail={getSizeDetail}
          createPrint={createPrint}
          getPrintDetail={getPrintDetail}
          updatePrintDetail={updatePrintDetail}
          removePrintDetail={removePrint}
        />
        <div className="flex-1 flex space-x-4">
          <div className="flex-1">
            <TextButton theme="light" text="Preview PDF" />
          </div>
          <div className="flex-1">
            <TextButton theme="dark" text="Create Order" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFirebase(Form);
