import React from "react";

export default function SelectInput({
  label,
  name,
  register,
  className = "sm:col-span-2",
  options = [],
  isRequired = true,
  errors,
  validation = {},
}) {
  // Default validation rules
  const defaultValidation = {
    required: isRequired ? `${label} is required` : false,
    ...validation
  };

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 mb-2"
      >
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        <select
          {...register(`${name}`, defaultValidation)}
          id={name}
          name={name}
          className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
            errors[`${name}`] 
              ? 'ring-red-300 focus:ring-red-500' 
              : 'ring-gray-300'
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option, i) => {
            return (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
        {errors[`${name}`] && (
          <span className="text-sm text-red-600 mt-1 block">
            {errors[`${name}`]?.message || `${label} is required`}
          </span>
        )}
      </div>
    </div>
  );
}
