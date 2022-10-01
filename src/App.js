import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forget from "./pages/Forget";
import { withFirebase } from "./services/Firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

const App = ({ firebase }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebase.auth, (user) => {
      setIsAuthenticated(user !== null);
    });
  }, []);

  if (isAuthenticated === null) return <div>Loading</div>;

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {isAuthenticated ? <Redirect to={{ pathname: "/" }} /> : <Login />}
        </Route>
        <Route path="/signup">
          {isAuthenticated ? <Redirect to={{ pathname: "/" }} /> : <SignUp />}
        </Route>
        <Route path="/forget">
          {isAuthenticated ? <Redirect to={{ pathname: "/" }} /> : <Forget />}
        </Route>
        <Route path="/new">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <New />
          )}
        </Route>
        <Route path="/">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Home />
          )}
        </Route>
      </Switch>
    </Router>
  );
};

export default withFirebase(App);
