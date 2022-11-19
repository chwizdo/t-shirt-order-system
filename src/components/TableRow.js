import IconButton from "./IconButton";
import SelectBox from "./SelectBox";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { withModelUtil } from "../services/ModelUtil";

const TableRow = ({
  id,
  order,
  status,
  onEntryClicked = () => {},
  onStatusChanged = () => {},
  modelUtil,
}) => {
  return (
    <div className="flex space-x-4">
      {/* Data Summary */}

      <div className="flex flex-1 min-w-0 border-2 border-grey rounded-lg h-13 px-6 items-center space-x-8">
        <div className="w-20 truncate">{id}</div>
        <div className="w-24">
          {moment(modelUtil.getTreeInfo(order, "date")).format("YYYY-MM-DD")}
        </div>
        <div className="flex-1 min-w-0 truncate">
          {modelUtil.getTreeInfo(
            modelUtil.getTreeInfo(order, "customer"),
            "name"
          ) || "No Customer specified"}
        </div>
      </div>

      {/* Dropdown */}

      <div className="w-[162px]">
        <SelectBox
          list={status}
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "status"))}
          onChanged={onStatusChanged}
        />
      </div>

      {/* Icon Button */}

      <div className="">
        <IconButton onClick={onEntryClicked} Icon={ChevronRightIcon} />
      </div>
    </div>
  );
};

export default withModelUtil(TableRow);
