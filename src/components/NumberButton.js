export default ({ number = 0, selected = false, onClick = () => {} }) => (
  <div>
    <button
      className={`h-13 w-13 flex justify-center items-center rounded-lg bg-white text-black hover:bg-white-hover active:bg-white-hover border-2 ${
        selected ? "border-black" : "border-grey"
      } `}
      onClick={onClick}
    >
      {number}
    </button>
  </div>
);
