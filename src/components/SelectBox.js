import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export default ({
  list = [],
  value = null,
  onChanged = () => {},
  placeholder = "Placeholder",
}) => {
  return (
    <div>
      <Listbox value={value} onChange={onChanged}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white h-13 pl-6 pr-14 text-left border-2 border-grey outline-none focus:border-black">
            <span
              className={`block truncate ${
                value ? "text-black" : "text-light-grey"
              }`}
            >
              {value ? value.name : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
              <ChevronDownIcon
                className="h-6 w-6 text-grey"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-4 max-h-60 w-full overflow-auto rounded-lg bg-white text-base border-2 border-black outline-none z-50">
              {list.map((item) => (
                <Listbox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative cursor-default select-none h-13 px-6 flex items-center outline-none ${
                      active ? "bg-black text-white" : "text-black"
                    }`
                  }
                  value={item}
                >
                  <div className="truncate">{item.name}</div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
