import { createContext } from "react";

const ModelUtilContext = createContext(null);

const withModelUtil = (Component) => (props) => {
  return (
    <ModelUtilContext.Consumer>
      {(modelUtil) => <Component {...props} modelUtil={modelUtil} />}
    </ModelUtilContext.Consumer>
  );
};

export default ModelUtilContext;

export { withModelUtil };
