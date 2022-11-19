import { PencilIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useState } from "react";
import IconButton from "../../components/IconButton";
import TextField from "../../components/TextField";
import { withModelUtil } from "../../services/ModelUtil";

const MemberName = ({
  name: initialName = "",
  onEditHandler = async () => {},
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(initialName);

  const enterEditMode = () => setIsEditMode(true);
  const exitEditMode = () => {
    setName(initialName);
    setIsEditMode(false);
  };
  const edit = async () => {
    await onEditHandler(name);
    exitEditMode();
  };

  useEffect(() => setName(initialName), [initialName]);

  if (isEditMode) {
    return (
      <div className="flex space-x-4">
        <IconButton theme="error" Icon={XMarkIcon} onClick={exitEditMode} />
        <div className="flex-1">
          <TextField
            placeholder="Edit entry"
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
      <div className="h-13 border-2 border-grey rounded-lg px-6 flex items-center flex-1">
        {name}
      </div>
      <IconButton theme="light" Icon={PencilIcon} onClick={enterEditMode} />
    </div>
  );
};

export default withModelUtil(MemberName);
