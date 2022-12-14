import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import IconButton from "../../components/IconButton";
import { withModelUtil } from "../../services/ModelUtil";

const SettingItem = ({
  id = "",
  name = "",
  forIsActive = true,
  onRemoveHandler = async () => {},
}) => {
  const remove = async () => await onRemoveHandler(id);

  return (
    <div className="flex space-x-4">
      <IconButton
        theme={forIsActive ? "error-light" : "light"}
        Icon={forIsActive ? MinusIcon : PlusIcon}
        onClick={remove}
      />
      <div className="h-13 border-2 border-grey rounded-lg px-6 flex items-center flex-1">
        {name}
      </div>
    </div>
  );
};

export default withModelUtil(SettingItem);
