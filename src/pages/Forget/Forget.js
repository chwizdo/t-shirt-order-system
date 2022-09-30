import { withFirebase } from "../../services/Firebase";
import Header from "../../components/Header";
import TextField from "../../components/TextField";
import TextButton from "../../components/TextButton";
import { Link } from "react-router-dom";

const Forget = () => {
  return (
    <div className="h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="container space-y-4 py-12 px-4">
          <TextField placeholder="Email" />
          <TextButton text="Reset Password" />
          <div className="flex justify-center">
            <Link to="/login" className="leading-tight underline">
              Login Again
            </Link>
          </div>
          <div className="flex justify-center">
            <Link to="/signup" className="leading-tight underline">
              Sign Up Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFirebase(Forget);
