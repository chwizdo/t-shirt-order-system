import { Combobox, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default ({
  placeholder = "Placeholder",
  list = {},
  value = null,
  onChanged = () => {},
}) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(list);

  useEffect(() => {
    if (query === "") {
      setFiltered(list);
    } else {
      const filtered = { [query]: { name: query } };
      for (const key in list) {
        if (!isMatched(list[key].name, query)) continue;
        filtered[key] = list[key];
      }
      setFiltered(filtered);
    }
  }, [query]);

  const isMatched = (string, query) => {
    return string
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(query.toLowerCase().replace(/\s+/g, ""));
  };

  return (
    <div>
      <Combobox value={value} onChange={onChanged}>
        <div className="relative">
          <div className="relative">
            <Combobox.Input
              className="w-full border-2 border-grey h-13 pl-6 pr-14 rounded-lg leading-tight text-black outline-none focus:border-black transition"
              displayValue={(key) => key && filtered[key].name}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-6">
              <ChevronDownIcon
                className="h-6 w-6 text-grey"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-4 max-h-60 w-full overflow-y-auto rounded-lg bg-white outline-none border-2 border-black z-50">
              {Object.keys(filtered).length === 0 ? (
                <div className="cursor-default select-none h-13 px-6 text-light-grey flex items-center">
                  Nothing found.
                </div>
              ) : (
                Object.keys(filtered).map((key) => (
                  <Combobox.Option
                    key={key}
                    className={({ active }) =>
                      `cursor-default select-none h-13 px-6 flex items-center inset-0 w-full border-none ${
                        active ? "bg-black text-white" : "text-black"
                      }`
                    }
                    value={key}
                  >
                    <div className="truncate">{filtered[key].name}</div>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
