import IconButton from "./IconButton";
import SelectBox from "./SelectBox";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default ({ onEntryClicked = () => {}, onStatusChanged = () => {} }) => {
  return (
    <div className="flex space-x-4">
      {/* Data Summary */}

      <div className="flex flex-1 min-w-0 border-2 border-grey rounded-lg h-13 px-6 items-center space-x-8">
        <div className="w-20">O220902A</div>
        <div className="w-24">2022/09/02</div>
        <div className="flex-1 min-w-0 truncate">Johnathan Liew</div>
      </div>

      {/* Dropdown */}

      <div className="w-[162px]">
        <SelectBox />
      </div>

      {/* Icon Button */}

      <div className="">
        <IconButton onClick={onEntryClicked} Icon={ChevronRightIcon} />
      </div>
    </div>
  );
};
