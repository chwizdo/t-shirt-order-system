import {
  PencilIcon,
  MinusIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useState } from "react";
import IconButton from "../../components/IconButton";
import TextField from "../../components/TextField";
import { withModelUtil } from "../../services/ModelUtil";

const SettingItem = ({
  id = "",
  name: initialName = "",
  onEditHandler = async () => {},
  onRemoveHandler = async () => {},
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(initialName);

  const enterEditMode = () => setIsEditMode(true);
  const exitEditMode = () => {
    setName(initialName);
    setIsEditMode(false);
  };
  const edit = async () => {
    await onEditHandler(id, name);
    exitEditMode();
  };
  const remove = async () => await onRemoveHandler(id);

  useEffect(() => setName(initialName), [initialName]);

  if (isEditMode) {
    return (
      <div className="flex space-x-4">
        <IconButton theme="error" Icon={XMarkIcon} onClick={exitEditMode} />
        <div className="flex-1">
          <TextField
            placeholder=""
            value={name}
            onChanged={(newName) => setName(newName)}
          />
        </div>
        <IconButton theme="dark" Icon={CheckIcon} onClick={edit} />
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      <IconButton theme="error-light" Icon={MinusIcon} onClick={remove} />
      <div className="h-13 border-2 border-grey rounded-lg px-6 flex items-center flex-1">
        {name}
      </div>
      <IconButton theme="light" Icon={PencilIcon} onClick={enterEditMode} />
    </div>
  );
};

export default withModelUtil(SettingItem);
