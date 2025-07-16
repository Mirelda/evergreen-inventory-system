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
  value,
  onChange,
  error,
  placeholder,
}) {
  // If register is provided, use react-hook-form
  if (register) {
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
            id={name}
            {...register(name, defaultValidation)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {errors && errors[name] && (
          <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>
        )}
      </div>
    );
  }

  // If onChange and value are provided, use controlled component
  if (onChange && value !== undefined) {
    const handleChange = (e) => {
      // Event object kontrolü
      if (!e || !e.target) {
        console.error('SelectInput: Invalid event object:', e);
        return;
      }

      console.log('SelectInput onChange:', name, e.target.value); // Debug için
      if (onChange) {
        onChange(e);
      }
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
            id={name}
            name={name}
            value={value || ""}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Default uncontrolled component
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
          id={name}
          name={name}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
