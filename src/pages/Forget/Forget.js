import { withFirebase } from "../../services/Firebase";
import Header from "../../components/Header";
import TextField from "../../components/TextField";
import TextButton from "../../components/TextButton";
import { Link } from "react-router-dom";
import { useState } from "react";
import MessageBox from "../../components/MessageBox";

const Forget = ({ firebase }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="container space-y-4 py-12 px-4">
          <TextField placeholder="Email" value={email} onChanged={setEmail} />
          <TextButton
            text="Reset Password"
            isLoading={isLoading}
            onClicked={async () => {
              setError(null);
              setSuccess(null);
              setIsLoading(true);
              const error = await firebase.resetPassword(email);
              error ? setError(error) : setSuccess("Reset password email sent");
              setIsLoading(false);
            }}
          />
          {error && <MessageBox message={`Error: ${error}`} type="error" />}
          {success && (
            <MessageBox message={`Success: ${success}`} type="info" />
          )}
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
