export default ({
  placeholder = "Placeholder",
  type = "text",
  value = "",
  onChanged = () => {},
}) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-13 border-2 border-grey rounded-lg px-6 outline-none focus:border-black transition"
      value={value}
      onChange={(e) => onChanged(e.target.value)}
    />
  </div>
);
