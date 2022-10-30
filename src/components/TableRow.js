import IconButton from "./IconButton";
import SelectBox from "./SelectBox";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import moment from "moment";

export default ({
  order,
  status,
  onEntryClicked = () => {},
  onStatusChanged = () => {},
}) => {
  return (
    <div className="flex space-x-4">
      {/* Data Summary */}

      <div className="flex flex-1 min-w-0 border-2 border-grey rounded-lg h-13 px-6 items-center space-x-8">
        <div className="w-20">{order.id}</div>
        <div className="w-24">{moment(order.date).format("YYYY-MM-DD")}</div>
        <div className="flex-1 min-w-0 truncate">
          {order.customer
            ? Object.values(order.customer)[0].name
            : "No customer specified"}
        </div>
      </div>

      {/* Dropdown */}

      <div className="w-[162px]">
        <SelectBox
          list={status}
          value={Object.keys(order.status)[0]}
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
