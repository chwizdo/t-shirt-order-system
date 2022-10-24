import moment from "moment";

class ModelUtil {
  constructor(firebase) {
    this.firebase = firebase;
    console.log(this.firebase);
  }

  getTreeId = (tree) => {
    const treeCopy = { ...tree };
    return Object.keys(treeCopy)[0];
  };

  getTreeInfos = (tree) => {
    const treeCopy = { ...tree };
    return Object.values(treeCopy)[0];
  };

  getTreeInfo = (tree, name) => {
    const treeCopy = { ...tree };
    return Object.values(treeCopy)[0][name];
  };

  updateTreeInfo = (tree, name, value) => {
    const treeCopy = { ...tree };
    Object.values(treeCopy)[0][name] = value;
    return treeCopy;
  };

  updateSubTree = (parentTree, name, childTree) => {
    const parentTreeCopy = { ...parentTree };
    const childTreeId = this.getTreeId(childTree);
    const childTreeInfos = this.getTreeInfos(childTree);
    Object.values(parentTreeCopy)[0][name][childTreeId] = childTreeInfos;
    return parentTreeCopy;
  };

  removeSubTree = (parentTree, name, childTreeId) => {
    const parentTreeCopy = { ...parentTree };
    delete Object.values(parentTreeCopy)[0][name][childTreeId];
    return parentTreeCopy;
  };

  getEmptyPrint = () => ({
    [this.firebase.generateDocId()]: {
      name: "",
      number: "",
      quantity: 1,
    },
  });

  getEmptySize = (size) => ({
    [this.firebase.generateDocId()]: {
      size: size,
      prints: this.getEmptyPrint(),
    },
  });

  getEmptyVariation = (collar, sleeve, size) => ({
    [this.firebase.generateDocId()]: {
      collar: collar,
      color: "#FF0000",
      sleeve: sleeve,
      sizes: this.getEmptySize(size),
    },
  });

  getNewOrderId = async () => {
    const lastId = await this.firebase.getLatestOrderId();
    let newId = moment(new Date()).format("YYMMDD");
    if (lastId != null && lastId.startsWith(newId)) {
      const lastCount = lastId.split(newId)[1];
      const newCount = parseInt(lastCount) + 1;
      newId += newCount;
    } else {
      newId += "1";
    }
    return newId;
  };

  getEmptyOrder = async (customer, designer, material, status) => {
    const orderId = await this.getNewOrderId();
    return {
      [this.firebase.generateDocId()]: {
        customer: customer,
        date: new Date(),
        design: "",
        designer: designer,
        id: orderId,
        material: material,
        remark: "",
        status: status,
        variations: {},
      },
    };
  };
}

export default ModelUtil;
