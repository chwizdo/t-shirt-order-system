import Header from "../../components/Header";
import {
  ChevronLeftIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import ComboBox from "../../components/ComboBox";
import TextField from "../../components/TextField";
import DatePicker from "../../components/DatePicker";
import SelectBox from "../../components/SelectBox";
import IconButton from "../../components/IconButton";
import TextButton from "../../components/TextButton";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { withFirebase } from "../../services/Firebase";
import { collection, doc } from "firebase/firestore";

const Form = ({ firebase }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState({});
  const [sizes, setSizes] = useState({});
  const [materials, setMaterials] = useState({});
  const [status, setStatus] = useState({});
  const [sleeves, setSleeves] = useState({});
  const [collars, setCollars] = useState({});
  const [order, setOrder] = useState({});
  const [size, setSize] = useState(null);

  const { orderId } = useParams();

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    console.log({ ...order });
  }, [order]);

  const getInitialData = async () => {
    setCustomers(await firebase.getChoices("customers"));
    setSizes(await firebase.getChoices("sizes"));
    setMaterials(await firebase.getChoices("materials"));
    setStatus(await firebase.getChoices("status"));
    setSleeves(await firebase.getChoices("sleeves"));
    setCollars(await firebase.getChoices("collars"));
    setOrder(await firebase.getOrder(orderId));
    setSize(sizes[0]);
    setIsLoading(false);
  };

  const getOrderReferenceId = (key) => {
    const reference = getOrderDetails(key);
    if (!reference) return reference;
    return Object.keys(reference)[0];
  };

  const getOrderDetails = (key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId][key];
  };

  const updateOrderDetail = (key, value) => {
    const tempOrder = { ...order };
    tempOrder[orderId][key] = value;
    setOrder(tempOrder);
  };

  const getVariationDetail = (variationId, key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId].variations[variationId][key];
  };

  const getVariationReferenceId = (variationId, key) => {
    const reference = getVariationDetail(variationId, key);
    if (!reference) return reference;
    return Object.keys(reference)[0];
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

  const getSizeDetail = (variationId, sizeId, key) => {
    const tempOrder = { ...order };
    return tempOrder[orderId].variations[variationId].sizes[sizeId][key];
  };

  const getSizeReferenceDetail = (variationId, sizeId, key) => {
    const reference = getSizeDetail(variationId, sizeId, key);
    if (!reference) return reference;
    return Object.values(reference)[0];
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

  const removePrintDetail = (variationId, sizeId, printId) => {
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

  const addVariation = () => {
    const variationId = generateVariationId();
    const sizeId = generateSizeId(variationId);
    const printId = generatePrintId(variationId, sizeId);
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId] = createEmptyVariation(
      sizeId,
      printId,
      Object.keys(sizes)[0]
    );
    setOrder(tempOrder);
  };

  const addSize = (variationId, selectedSizeId) => {
    const sizeId = generateSizeId(variationId);
    const printId = generatePrintId(variationId, sizeId);
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId].sizes[sizeId] = createEmptySize(
      printId,
      selectedSizeId
    );
    setOrder(tempOrder);
  };

  const addPrint = (variationId, sizeId) => {
    const printId = generatePrintId(variationId, sizeId);
    const tempOrder = { ...order };
    tempOrder[orderId].variations[variationId].sizes[sizeId].prints[printId] =
      createEmptyPrint();
    setOrder(tempOrder);
  };

  const generateVariationId = () =>
    doc(collection(firebase.db, "orders", orderId, "variations")).id;

  const generateSizeId = (variationId) =>
    doc(
      collection(
        firebase.db,
        "orders",
        orderId,
        "variations",
        variationId,
        "sizes"
      )
    ).id;

  const generatePrintId = (variationId, sizeId) =>
    doc(
      collection(
        firebase.db,
        "orders",
        orderId,
        "variations",
        variationId,
        "sizes",
        sizeId,
        "prints"
      )
    ).id;

  const createEmptyPrint = () => ({
    name: "",
    number: "",
    quantity: "",
  });

  const createEmptySize = (printId, sizeId) => ({
    size: { [sizeId]: sizes[sizeId] },
    prints: { [printId]: createEmptyPrint() },
  });

  const createEmptyVariation = (sizeId, printId, selectedSizeId) => ({
    collar: { [Object.keys(collars)[0]]: Object.values(collars)[0] },
    color: "#FF0000",
    sleeve: { [Object.keys(sleeves)[0]]: Object.values(sleeves)[0] },
    sizes: { [sizeId]: createEmptySize(printId, selectedSizeId) },
  });

  const customStyles = {
    content: {
      width: "320px",
      height: "320px",
      margin: "auto",
      borderRadius: "0.5rem",
      border: "2px solid #101010",
    },
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => setSize(sizes[0]);

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
        {/* Back Button */}

        <Link to="/" className="flex space-x-2 mb-12">
          <ChevronLeftIcon className="w-5 h-5 text-black" />
          <span className="leading-tight underline">Back to Homepage</span>
        </Link>

        {/* Order Number */}

        <div className="text-xl leading-tight mb-12">O220916A</div>

        {/* Details */}

        <div className="flex space-x-4 mb-12">
          {/* Details 1st Column */}

          <div className="flex-1 space-y-4">
            <ComboBox
              placeholder="Select Customer"
              list={customers}
              value={getOrderReferenceId("customer")}
              onChanged={(key) =>
                updateOrderDetail("customer", { [key]: customers[key] })
              }
            />
            <TextField
              placeholder="Design Name"
              value={getOrderDetails("design")}
              onChanged={(value) => updateOrderDetail("design", value)}
            />
            <ComboBox
              placeholder="Select Designer"
              list={customers}
              value={getOrderReferenceId("customer")}
              onChanged={(key) =>
                updateOrderDetail("customer", { [key]: customers[key] })
              }
            />
            <ComboBox
              placeholder="Select Material"
              list={materials}
              value={getOrderReferenceId("material")}
              onChanged={(key) =>
                updateOrderDetail("material", { [key]: materials[key] })
              }
            />
            <DatePicker
              value={getOrderDetails("date")}
              onChanged={(value) => updateOrderDetail("date", value)}
            />
            <SelectBox
              list={status}
              value={getOrderReferenceId("status")}
              onChanged={(key) =>
                updateOrderDetail("status", { [key]: status[key] })
              }
            />
          </div>

          {/* Details 2nd Column (Image and Remarks) */}

          <div className="w-64 space-y-4 flex flex-col">
            <div className="h-64 rounded-lg overflow-hidden border-2 border-grey">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              />
            </div>
            <textarea
              className="border-2 border-grey rounded-lg flex-1 py-4 px-6 outline-none focus:border-black transition"
              placeholder="Remarks"
              value={getOrderDetails("remark") || ""}
              onChange={(e) => updateOrderDetail("remark", e.target.value)}
            />
          </div>
        </div>

        {Object.keys(getOrderDetails("variations")).map((vId, vIdx) => (
          <div key={vId}>
            {/* Variation title */}

            <div className="text-xl leading-tight mb-12">
              VARIATION {vIdx + 1}
            </div>

            <div className="flex space-x-4 mb-6">
              {/* Variation remove button */}

              <IconButton
                Icon={TrashIcon}
                theme="error"
                onClick={() => removeVariation(vId)}
              />

              {/* Variation sleeve dropdown */}

              <div className="flex-1">
                <SelectBox
                  placeholder="Select Sleeve"
                  list={sleeves}
                  value={getVariationReferenceId(vId, "sleeve")}
                  onChanged={(key) =>
                    updateVariationDetail(vId, "sleeve", {
                      [key]: sleeves[key],
                    })
                  }
                />
              </div>

              {/* Variation collar dropdown */}

              <div className="flex-1">
                <SelectBox
                  placeholder="Select Collar"
                  list={collars}
                  value={getVariationReferenceId(vId, "collar")}
                  onChanged={(key) =>
                    updateVariationDetail(vId, "collar", {
                      [key]: collars[key],
                    })
                  }
                />
              </div>

              {/* Variation color picker */}

              <label className="relative block w-[104px] h-13 rounded-lg overflow-hidden">
                <input
                  type="color"
                  className="w-full h-full absolute inset-0"
                  value={getVariationDetail(vId, "color")}
                  onChange={(e) =>
                    updateVariationDetail(vId, "color", e.target.value)
                  }
                />
                <div
                  className={"absolute inset-0"}
                  style={{ backgroundColor: getVariationDetail(vId, "color") }}
                ></div>
              </label>
            </div>

            {Object.keys(getVariationDetail(vId, "sizes")).map((sId, sIdx) => {
              return (
                <div key={sIdx}>
                  {/* Variation size title */}
                  <div className="text-base leading-tight mb-6">
                    {`${getSizeReferenceDetail(vId, sId, "size").name} SIZE | ${
                      Object.keys(getSizeDetail(vId, sId, "size")).length
                    } TOTAL`}
                  </div>
                  {Object.keys(getSizeDetail(vId, sId, "prints")).map(
                    (pId, pIdx) => {
                      return (
                        <div key={pId} className="flex space-x-4 mb-4">
                          {/* Variation size print remove button */}
                          <IconButton
                            Icon={MinusIcon}
                            theme="error-light"
                            onClick={() => removePrintDetail(vId, sId, pId)}
                          />
                          {/* Variation size print name field */}
                          <div className="flex-1">
                            <TextField
                              placeholder="Name (Optional)"
                              value={getPrintDetail(vId, sId, pId, "name")}
                              onChanged={(value) =>
                                updatePrintDetail(vId, sId, pId, "name", value)
                              }
                            />
                          </div>
                          {/* Variation size print number field */}
                          <div className="flex-1">
                            <TextField
                              placeholder="Number (Optional)"
                              value={getPrintDetail(vId, sId, pId, "number")}
                              onChanged={(value) =>
                                updatePrintDetail(
                                  vId,
                                  sId,
                                  pId,
                                  "number",
                                  value
                                )
                              }
                            />
                          </div>
                          {/* Variation size print quantity field */}
                          <div className="w-[104px]">
                            <TextField
                              placeholder="1"
                              value={getPrintDetail(vId, sId, pId, "quantity")}
                              onChanged={(value) =>
                                updatePrintDetail(
                                  vId,
                                  sId,
                                  pId,
                                  "quantity",
                                  value
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                  {/* Variation size print add button */}
                  <div className=" mb-6">
                    <IconButton
                      Icon={PlusIcon}
                      theme="light"
                      onClick={() => addPrint(vId, sId)}
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex-1 mb-12">
              <TextButton
                theme="light"
                text="Add Size"
                onClicked={() => openModal()}
              />
            </div>

            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
              ariaHideApp={false}
            >
              <div className="mb-4">
                <span
                  className="leading-tight underline text-black cursor-pointer"
                  onClick={closeModal}
                >
                  Close
                </span>
              </div>
              <div className="space-y-4">
                {Object.keys(sizes).map((sId) => (
                  <TextButton
                    key={sId}
                    theme="light"
                    text={sizes[sId].name}
                    onClicked={() => {
                      addSize(vId, sId);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </Modal>
          </div>
        ))}

        {/* Add Variation */}

        <div className="flex-1 mb-12">
          <TextButton
            theme="light"
            text="Add New Variation"
            onClicked={() => addVariation()}
          />
        </div>

        {/* Add Variation */}

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
