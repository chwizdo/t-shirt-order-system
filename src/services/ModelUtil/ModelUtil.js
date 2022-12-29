class ModelUtil {
  constructor(firebase) {
    this.firebase = firebase;
  }

  getTreeId = (tree) => {
    if (!tree) return null;
    const treeCopy = { ...tree };
    return Object.keys(treeCopy)[0];
  };

  getTreeInfos = (tree) => {
    const treeCopy = { ...tree };
    return Object.values(treeCopy)[0];
  };

  getTreeInfo = (tree, name) => {
    if (!tree) return null;
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

  getEmptyOrder = async (customer, designer, material, status) => {
    return {
      [this.firebase.generateDocId()]: {
        customer: customer,
        date: new Date(),
        design: "",
        designer: designer,
        material: material,
        remark: "",
        status: status,
        variations: {},
        image: "",
        isVisible: true,
        id: (await this.firebase.getCount()) + 1,
        link: "",
      },
    };
  };
}

export default ModelUtil;
