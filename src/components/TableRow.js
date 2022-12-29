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
      <div className="w-13 h-13 bg-red-200"></div>

      {/* Data Summary */}

      <div
        className="flex flex-1 min-w-0 border-2 border-grey rounded-lg h-13 px-6 items-center space-x-8 hover:bg-white-hover cursor-pointer"
        onClick={onEntryClicked}
      >
        <div className="w-12 truncate">{id}</div>
        <div className="w-[5.25rem] hidden md:block">
          {moment(modelUtil.getTreeInfo(order, "date")).format("YYYY-MM-DD")}
        </div>
        <div className="flex-1 truncate">
          {modelUtil.getTreeInfo(order, "design")}
        </div>
        <div className="flex-1 min-w-0 truncate">
          {modelUtil.getTreeInfo(
            modelUtil.getTreeInfo(order, "customer"),
            "name"
          ) || "No Customer specified"}
        </div>
      </div>

      {/* Dropdown */}

      <div className="w-[162px] hidden sm:block">
        <SelectBox
          list={status}
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "status"))}
          onChanged={onStatusChanged}
        />
      </div>

      {/* Icon Button */}

      {/* <div className="">
        <IconButton onClick={onEntryClicked} Icon={ChevronRightIcon} />
      </div> */}
    </div>
  );
};

export default withModelUtil(TableRow);
