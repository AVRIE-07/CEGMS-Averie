import React from "react";

function CustomInput({ placeholder, name, type, value, onChange, error }) {
  return (
    <>
      <input
        type={type}
        className={`form-control border-bottom rounded-0 border-top-0 border-end-0 border-start-0 ps-0 ${
          error ? "is-invalid border-danger" : ""
        }`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: "100%" }}
      />
    </>
  );
}

export default CustomInput;
