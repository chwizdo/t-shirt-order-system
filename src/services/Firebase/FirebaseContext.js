import { createContext } from "react";

const FirebaseContext = createContext(null);

const withFirebase = (Component) => (props) => {
  return (
    <FirebaseContext.Consumer>
      {(firebase) => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  );
};

export default FirebaseContext;

export { withFirebase };
