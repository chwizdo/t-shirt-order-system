import { withFirebase } from "../../services/Firebase";
import Header from "../../components/Header";
import TextField from "../../components/TextField";
import TextButton from "../../components/TextButton";
import { Link } from "react-router-dom";
import { useState } from "react";
import MessageBox from "../../components/MessageBox";

const SignUp = ({ firebase }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="container space-y-4 py-12 px-4">
          <TextField placeholder="Name" value={name} onChanged={setName} />
          <TextField placeholder="Email" value={email} onChanged={setEmail} />
          <TextField
            placeholder="Password"
            value={password}
            onChanged={setPassword}
            type="password"
          />
          <TextField
            placeholder="Invitation Code"
            value={invitationCode}
            onChanged={setInvitationCode}
          />
          <TextButton
            text="Sign Up"
            isLoading={isLoading}
            onClicked={async () => {
              setError(null);
              setIsLoading(true);
              const error = await firebase.signUp(
                name,
                email,
                password,
                invitationCode
              );
              setIsLoading(false);
              if (error) setError(error);
            }}
          />
          {error && <MessageBox message={`Error: ${error}`} type="error" />}
          <div className="flex justify-center">
            <Link to="/login" className="leading-tight underline">
              Login Up Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFirebase(SignUp);
