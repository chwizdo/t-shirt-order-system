import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forget from "./pages/Forget";

export default () => (
  <Router>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/forget">
        <Forget />
      </Route>
      <Route path="/new">
        <New />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);
