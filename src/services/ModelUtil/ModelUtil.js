class ModelUtil {
  constructor(firebase) {
    this.firebase = firebase;
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
}

export default ModelUtil;
