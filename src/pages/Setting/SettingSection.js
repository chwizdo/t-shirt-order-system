import { withModelUtil } from "../../services/ModelUtil";
import SettingSectionItem from "./SettingSectionItem";
import SettingSectionHeader from "./SettingSectionHeader";
import { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import TextField from "../../components/TextField";
import IconButton from "../../components/IconButton";

const SettingSection = ({
  title = "Title",
  addButtonText = "Text",
  onAddButtonClicked: onAddHandler = () => {},
  trees = {},
  onEditHandler = async () => {},
  onRemoveHandler = async () => {},
  modelUtil,
}) => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [name, setName] = useState("");

  const onAddButtonClicked = () => {
    setIsCreateMode(true);
  };

  const exitCreateMode = () => {
    setName("");
    setIsCreateMode(false);
  };

  const enterCreateMode = () => setIsCreateMode(true);

  return (
    <div className="mb-12">
      <SettingSectionHeader
        title={title}
        addButtonText={addButtonText}
        onAddButtonClicked={onAddButtonClicked}
      />
      <div className="space-y-4">
        {isCreateMode && (
          <div className="flex space-x-4">
            <IconButton
              theme="error"
              Icon={XMarkIcon}
              onClick={exitCreateMode}
            />
            <div className="flex-1">
              <TextField
                placeholder="New entry"
                value={name}
                onChanged={(newName) => setName(newName)}
              />
            </div>
            <IconButton theme="dark" Icon={CheckIcon} />
          </div>
        )}
        {Object.entries(trees).map(([id, infos]) => {
          const tree = { [id]: infos };
          const name = modelUtil.getTreeInfo(tree, "name");
          return (
            <SettingSectionItem
              key={id}
              id={id}
              name={name}
              onEditHandler={onEditHandler}
              onRemoveHandler={onRemoveHandler}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withModelUtil(SettingSection);
