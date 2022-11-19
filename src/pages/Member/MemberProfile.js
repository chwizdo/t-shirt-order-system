import { withModelUtil } from "../../services/ModelUtil";
import MemberSectionHeader from "./MemberSectionHeader";
import MemberProfileName from "./MemberProfileName";
import { withFirebase } from "../../services/Firebase";

const MemberProfile = ({
  title = "Title",
  name = "Name",
  onEditHandler = () => {},
  firebase,
}) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between mb-6">
        <div className="text-xl leading-tight">{title}</div>
      </div>
      <div className="space-y-4">
        <MemberProfileName name={name} onEditHandler={onEditHandler} />
        <div className="h-13 border-2 border-grey rounded-lg px-6 flex items-center flex-1">
          {firebase.auth.currentUser.email}
        </div>
      </div>
    </div>
  );
};

export default withFirebase(MemberProfile);
