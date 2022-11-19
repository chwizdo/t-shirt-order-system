import { withModelUtil } from "../../services/ModelUtil";
import MemberSectionItem from "./MemberSectionItem";
import MemberSectionHeader from "./MemberSectionHeader";
import { withFirebase } from "../../services/Firebase";

const MemberSection = ({
  title = "Title",
  showAddButton = true,
  addButtonText = "Text",
  trees = {},
  forIsActive = true,
  onAddHandler = async () => {},
  onItemClickHandler = async () => {},
  firebase,
  modelUtil,
}) => {
  return (
    <div className="mb-12">
      <MemberSectionHeader
        title={title}
        showAddButton={showAddButton}
        addButtonText={addButtonText}
        onAddButtonClicked={onAddHandler}
      />
      <div className="space-y-4">
        {Object.entries(trees).map(([id, infos]) => {
          const tree = { [id]: infos };
          const name = modelUtil.getTreeInfo(tree, "email");

          if (id === firebase.auth.currentUser.uid) return;

          return (
            <MemberSectionItem
              key={id}
              id={id}
              name={name}
              forIsActive={forIsActive}
              onRemoveHandler={onItemClickHandler}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withFirebase(withModelUtil(MemberSection));
