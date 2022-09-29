import { HomeIcon } from "@heroicons/react/24/solid";

export default ({
  Icon = HomeIcon,
  onClick = () => {},
  theme = "dark", // Choices: dark, light, error
}) => (
  <div>
    <button
      className={`h-13 w-13 flex justify-center items-center rounded-lg 
          ${
            theme == "light" &&
            "bg-white hover:bg-white-hover active:bg-white-hover text-black border-2 border-black"
          }
          ${
            theme == "error" &&
            "bg-error hover:bg-error-hover active:bg-error-hover text-white"
          }
          ${
            theme == "error-light" &&
            "bg-white hover:bg-white-hover active:bg-white-hover text-error border-2 border-error"
          }
          ${
            theme != "light" &&
            theme != "error" &&
            theme != "error-light" &&
            "bg-black hover:bg-black-hover active:bg-black-hover text-white"
          }
      `}
      onClick={onClick}
    >
      {<Icon className="w-6 h-6" />}
    </button>
  </div>
);
