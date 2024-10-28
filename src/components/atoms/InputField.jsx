// src/components/atoms/InputField.jsx
import React from "react";

const InputField = ({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  name,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-2 border rounded bg-gray-100"
      readOnly={disabled} // Tambahkan readOnly jika disabled untuk menghindari warning
    />
  </div>
);

export default InputField;
