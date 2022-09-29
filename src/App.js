import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import New from "./pages/New/New";

export default () => (
  <Router>
    <Switch>
      <Route path="/new">
        <New />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);
