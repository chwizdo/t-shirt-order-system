class ModelUtil {
  getTreeId = (tree) => {
    const treeCopy = { ...tree };
    return Object.keys(treeCopy)[0];
  };

  // getTreeInfos = (tree) => {
  //   const treeCopy = { ...tree };
  //   return Object.values(treeCopy)[0];
  // };

  getTreeInfo = (tree, name) => {
    const treeCopy = { ...tree };
    return Object.values(treeCopy)[0][name];
  };

  updateTreeInfo = (tree, name, value) => {
    const treeCopy = { ...tree };
    Object.values(treeCopy)[0][name] = value;
    return treeCopy;
  };
}

export default ModelUtil;
