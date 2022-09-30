import { withFirebase } from "../../services/Firebase";
import Header from "../../components/Header";
import TextField from "../../components/TextField";
import TextButton from "../../components/TextButton";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="container space-y-4 py-12 px-4">
          <TextField placeholder="Email" />
          <TextField placeholder="Password" />
          <TextButton text="Login" />
          <div className="flex justify-center">
            <Link to="/signup" className="leading-tight underline">
              Sign Up Instead
            </Link>
          </div>
          <div className="flex justify-center">
            <Link to="/forget" className="leading-tight underline">
              Forget Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFirebase(Login);
