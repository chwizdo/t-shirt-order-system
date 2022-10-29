import { PencilIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { withModelUtil } from "../../services/ModelUtil";
import IconButton from "../../components/IconButton";

const SettingSection = ({
  title = "Title",
  addText = "Add button text",
  tree = {},
  modelUtil,
}) => (
  <div className="mb-12">
    <div className="flex justify-between mb-6">
      <div className="text-xl leading-tight">{title}</div>
      <button className="flex underline space-x-2">
        <div>{addText}</div>
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
    <div className="space-y-4">
      {Object.entries(tree).map(([id, infos]) => {
        const entry = { [id]: infos };

        return (
          <div className="flex space-x-4">
            <IconButton theme="error-light" Icon={MinusIcon} />
            <div className="h-13 border-2 border-grey rounded-lg px-6 flex items-center flex-1">
              {modelUtil.getTreeInfo(entry, "name")}
            </div>
            <IconButton theme="light" Icon={PencilIcon} />
          </div>
        );
      })}
    </div>
  </div>
);

export default withModelUtil(SettingSection);
