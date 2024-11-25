function CustomSelect({
  value,
  handleChange,
  options,
  error,
  placeholder,
  name,
}) {
  return (
    <select
      onChange={handleChange}
      className={`form-select border-bottom rounded-0 border-top-0 border-end-0 border-start-0 ps-0 ${
        error ? "is-invalid border-danger" : ""
      }`}
      value={value}
      name={name}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((item) => (
        <option key={item.code} value={item.code}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

export default CustomSelect;
