// Choice for type: error, info.
export default ({ message, type }) => (
  <div
    className={`border-2 border-dashed rounded-lg h-13 flex justify-center items-center 
    ${type === "error" && "border-error text-error"} 
    ${type === "info" && "border-blue-500 text-blue-500"} 
    ${type !== "error" && type !== "info" && "border-black text-black"}`}
  >
    {message}
  </div>
);
