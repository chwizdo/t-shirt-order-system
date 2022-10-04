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

const sizes = [
  { id: 1, name: "XS" },
  { id: 2, name: "S" },
  { id: 3, name: "M" },
  { id: 4, name: "L" },
  { id: 5, name: "XL" },
  { id: 6, name: "2XL" },
  { id: 7, name: "3XL" },
];

const materials = [[1, "Cotton"]];

const initialVariations = [
  {
    sleeve: { id: 1, name: "Short Sleeve" },
    collar: { id: 1, name: "Round Neck" },
    color: "#00FF00",
    sizes: [
      {
        size: "s",
        prints: [
          { name: "John", number: "21", quantity: 1 },
          { name: "May", number: "07", quantity: 1 },
          { name: "Julia", number: "14", quantity: 1 },
        ],
      },
      {
        size: "m",
        prints: [{ name: "Amanda", number: "08", quantity: 1 }],
      },
    ],
  },
];

const Form = ({ firebase }) => {
  const [design, setDesign] = useState("");
  const [designer, setDesigner] = useState(null);
  const [material, setMaterial] = useState(null);
  const [date, setDate] = useState(new Date());
  const [remark, setRemark] = useState("");
  const [variations, setVariations] = useState(initialVariations);
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

        {variations.map((variation, variationIdx) => {
          return (
            <div key={variationIdx}>
              {/* Variation title */}

              <div className="text-xl leading-tight mb-12">
                VARIATION {variationIdx + 1}
              </div>

              <div className="flex space-x-4 mb-6">
                {/* Variation remove button */}

                <IconButton
                  Icon={TrashIcon}
                  theme="error"
                  onClick={() => {
                    const tempVariations = [...variations];
                    tempVariations.splice(variationIdx, 1);
                    setVariations(tempVariations);
                  }}
                />

                {/* Variation sleeve dropdown */}

                <div className="flex-1">
                  <SelectBox
                    list={sleeves}
                    placeholder="Select Sleeve"
                    // value={variation.sleeve}
                    // onChanged={(value) => {
                    //   const tempVariations = [...variations];
                    //   tempVariations[variationIdx].sleeve = value;
                    //   setVariations(tempVariations);
                    // }}
                    value={null}
                    onChanged={() => {}}
                  />
                </div>

                {/* Variation collar dropdown */}

                <div className="flex-1">
                  <SelectBox
                    list={collars}
                    placeholder="Select Collar"
                    // value={variation.collar}
                    // onChanged={(value) => {
                    //   const tempVariations = [...variations];
                    //   tempVariations[variationIdx].collar = value;
                    //   setVariations(tempVariations);
                    // }}
                    value={null}
                    onChanged={() => {}}
                  />
                </div>

                {/* Variation color picker */}

                <label className="relative block w-[104px] h-13 rounded-lg overflow-hidden">
                  <input
                    type="color"
                    className="w-full h-full absolute inset-0"
                    value={variation.color}
                    onChange={(e) => {
                      const tempVariations = [...variations];
                      tempVariations[variationIdx].color = e.target.value;
                      setVariations(tempVariations);
                    }}
                  />
                  <div
                    className={"absolute inset-0"}
                    style={{ backgroundColor: variation.color }}
                  ></div>
                </label>
              </div>

              {variation.sizes.map((size, sizeIdx) => {
                return (
                  <div key={sizeIdx}>
                    {/* Variation size title */}

                    <div className="text-base leading-tight mb-6">
                      {size.size.toUpperCase()} SIZE | {size.prints.length}{" "}
                      TOTAL
                    </div>

                    {size.prints.map((print, printIdx) => {
                      return (
                        <div key={printIdx} className="flex space-x-4 mb-4">
                          {/* Variation size print remove button */}

                          <IconButton
                            Icon={MinusIcon}
                            theme="error-light"
                            onClick={() => {
                              const tempVariations = [...variations];

                              // Remove size if the last print is removed,
                              // Otherwise just remove the selected print.
                              if (size.prints.length <= 1) {
                                const tempSizes = [...variation.sizes];
                                tempSizes.splice(sizeIdx, 1);
                                tempVariations[variationIdx].sizes = tempSizes;
                                setVariations(tempVariations);
                              } else {
                                const tempPrints = [...size.prints];
                                tempPrints.splice(printIdx, 1);
                                tempVariations[variationIdx].sizes[
                                  sizeIdx
                                ].prints = tempPrints;
                                setVariations(tempVariations);
                              }
                            }}
                          />

                          {/* Variation size print name field */}

                          <div className="flex-1">
                            <TextField
                              placeholder="Name (Optional)"
                              value={print.name}
                              onChanged={(value) => {
                                const tempVariations = [...variations];
                                tempVariations[variationIdx].sizes[
                                  sizeIdx
                                ].prints[printIdx].name = value;
                                setVariations(tempVariations);
                              }}
                            />
                          </div>

                          {/* Variation size print number field */}

                          <div className="flex-1">
                            <TextField
                              placeholder="Number (Optional)"
                              value={print.number}
                              onChanged={(value) => {
                                const tempVariations = [...variations];
                                tempVariations[variationIdx].sizes[
                                  sizeIdx
                                ].prints[printIdx].number = value;
                                setVariations(tempVariations);
                              }}
                            />
                          </div>

                          {/* Variation size print quantity field */}

                          <div className="w-[104px]">
                            <TextField
                              placeholder="1"
                              value={print.quantity}
                              onChanged={(value) => {
                                const tempVariations = [...variations];
                                tempVariations[variationIdx].sizes[
                                  sizeIdx
                                ].prints[printIdx].quantity = value;
                                setVariations(tempVariations);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Variation size print add button */}

                    <div className=" mb-6">
                      <IconButton
                        Icon={PlusIcon}
                        theme="light"
                        onClick={() => {
                          const tempVariations = [...variations];
                          tempVariations[variationIdx].sizes[
                            sizeIdx
                          ].prints.push({ name: "", number: "", quantity: "" });
                          setVariations(tempVariations);
                        }}
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

              {/* <Modal
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
                  {Object.keys(sizes).map((key) => (
                    <TextButton
                      key={key}
                      theme="light"
                      text={sizes[key].name}
                      onClicked={() => {
                        const tempVariations = [...variations];
                        tempVariations[variationIdx].sizes.push({
                          size: size.name,
                          prints: [{ name: "", number: "", quantity: 1 }],
                        });
                        setVariations(tempVariations);
                        closeModal();
                      }}
                    />
                  ))}
                </div>
              </Modal> */}
            </div>
          );
        })}

        {/* Add Variation */}

        <div className="flex-1 mb-12">
          <TextButton
            theme="light"
            text="Add New Variation"
            onClicked={() => {
              const tempVariations = [...variations];
              tempVariations.push({
                sleeve: sleeves[0],
                collar: collars[0],
                color: "#101010",
                sizes: [],
              });
              setVariations(tempVariations);
            }}
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
