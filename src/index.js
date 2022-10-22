import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Firebase, { FirebaseContext } from "./services/Firebase";
import ModelUtil, { ModelUtilContext } from "./services/ModelUtil";

const root = ReactDOM.createRoot(document.getElementById("root"));

const firebase = new Firebase();
const modelUtil = new ModelUtil(firebase);

root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={firebase}>
      <ModelUtilContext.Provider value={modelUtil}>
        <App />
      </ModelUtilContext.Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>
);
