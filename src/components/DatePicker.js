import { ChevronDownIcon } from "@heroicons/react/24/solid";
import moment from "moment";

export default ({ value = new Date(), onChanged = () => {} }) => (
  <div className="relative">
    <input
      id="new-date"
      type="date"
      className="w-full border-2 border-grey h-13 px-6 rounded-lg"
      value={moment(value).format("YYYY-MM-DD")}
      onChange={(e) => onChanged(new Date(e.target.value))}
    />
    <label
      htmlFor="new-date"
      className="absolute inset-y-0 right-6 flex items-center"
    >
      <ChevronDownIcon className="w-6 h-6 text-grey" />
    </label>
  </div>
);
