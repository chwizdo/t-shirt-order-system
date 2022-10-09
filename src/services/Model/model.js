import { collection, doc } from "firebase/firestore";

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

// const createEmptyPrint = () => ({
//   name: "",
//   number: "",
//   quantity: "",
// });

// const createEmptySize = (printId, sizeId) => ({
//   size: { [sizeId]: sizes[sizeId] },
//   prints: { [printId]: createEmptyPrint() },
// });

// const createEmptyVariation = (sizeId, printId, selectedSizeId) => ({
//   collar: null,
//   color: "#DE0000",
//   sleeve: null,
//   sizes: { [sizeId]: createEmptySize(printId, selectedSizeId) },
// });

const createEmptyPrint = (printId) => ({
  [printId]: { name: "", number: "", quantity: 1 },
});

const createEmptySize = (sizeId) => ({
  [sizeId]: { size: null, prints: createEmptyPrint() },
});

const createEmptyVariation = (variationId) => ({
  [variationId]: {
    collar: null,
    color: "#DE0000",
    sleeve: null,
    sizes: createEmptySize(),
  },
});

const createEmptyOrder = () => {
  return {
    [orderId]: {
      remark: "",
      customer: null,
      date: new Date(),
      design: "",
      designer: null,
      id: "",
      material: null,
      status: null,
      variations: createEmptyVariation(),
    },
  };
};
