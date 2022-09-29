import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Firebase, { FirebaseContext } from "./services/Firebase";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>
);
