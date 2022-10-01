import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

export default ({
  text = "Text",
  theme = "dark", // Choices: dark, light
  isLoading = false,
  onClicked = () => {},
}) => (
  <div>
    <button
      className={`w-full h-13 px-6 rounded-lg flex justify-center items-center 
      ${
        theme == "light" &&
        "bg-white hover:bg-white-hover active:bg-white-hover border-2 border-black text-black"
      }
      ${
        theme != "light" &&
        "bg-black hover:bg-black-hover active:bg-black-hover text-white"
      }`}
      onClick={isLoading ? null : onClicked}
    >
      {isLoading ? <EllipsisHorizontalIcon className="h-6 w-6" /> : text}
    </button>
  </div>
);
