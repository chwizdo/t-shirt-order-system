export default ({
  placeholder = "Placeholder",
  value = "",
  onChanged = () => {},
}) => (
  <div>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full h-13 border-2 border-grey rounded-lg px-6 outline-none focus:border-black transition"
      value={value}
      onChange={(e) => onChanged(e.target.value)}
    />
  </div>
);
