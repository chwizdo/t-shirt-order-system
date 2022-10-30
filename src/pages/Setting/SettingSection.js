import { withModelUtil } from "../../services/ModelUtil";
import SettingSectionItem from "./SettingSectionItem";
import SettingSectionHeader from "./SettingSectionHeader";

const SettingSection = ({
  title = "Title",
  addButtonText = "Text",
  onAddButtonClicked = () => {},
  trees = {},
  onEditHandler = () => {},
  modelUtil,
}) => {
  return (
    <div className="mb-12">
      <SettingSectionHeader
        title={title}
        addButtonText={addButtonText}
        onAddButtonClicked={onAddButtonClicked}
      />
      <div className="space-y-4">
        {Object.entries(trees).map(([id, infos]) => {
          const tree = { [id]: infos };
          const name = modelUtil.getTreeInfo(tree, "name");
          return (
            <SettingSectionItem
              key={id}
              id={id}
              name={name}
              onEditHandler={onEditHandler}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withModelUtil(SettingSection);
