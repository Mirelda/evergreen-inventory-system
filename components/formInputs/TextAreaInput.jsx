"use client";

import { useForm } from "react-hook-form";

function TextAreaInput({
  label,
  name,
  isRequired = true,
  register,
  errors,
  className = "sm:col-span-2",
  validation = {},
  placeholder,
  rows = 3,
  value,
  onChange,
  error,
}) {
  // If register is provided, use react-hook-form
  if (register) {
    // Default validation rules
    const defaultValidation = {
      required: isRequired ? `${label} is required` : false,
      ...validation
    };

    // Custom validation messages
    const getErrorMessage = (error) => {
      if (error?.type === 'required') {
        return `${label} is required`;
      }
      if (error?.type === 'minLength') {
        return `${label} must be at least ${validation.minLength} characters`;
      }
      if (error?.type === 'maxLength') {
        return `${label} must be less than ${validation.maxLength} characters`;
      }
      if (error?.type === 'pattern') {
        return validation.patternMessage || `${label} format is invalid`;
      }
      if (error?.type === 'validate') {
        return error.message || `${label} is invalid`;
      }
      return `${label} is invalid`;
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
          <textarea
            {...register(`${name}`, defaultValidation)}
            name={name}
            id={name}
            rows={rows}
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              errors[`${name}`] 
                ? 'ring-red-300 focus:ring-red-500' 
                : 'ring-gray-300'
            }`}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            defaultValue={""}
          />
          {errors[`${name}`] && (
            <span className="text-sm text-red-600 mt-1 block">
              {getErrorMessage(errors[`${name}`])}
            </span>
          )}
        </div>
      </div>
    );
  }

  // If no register, use normal textarea
  const handleChange = (e) => {
    // Event object kontrolü
    if (!e || !e.target) {
      console.error('TextAreaInput: Invalid event object:', e);
      return;
    }

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
        <textarea
          name={name}
          id={name}
          rows={rows}
          value={value || ''}
          onChange={handleChange}
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            error 
              ? 'ring-red-300 focus:ring-red-500' 
              : 'ring-gray-300'
          }`}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
        {error && (
          <span className="text-sm text-red-600 mt-1 block">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

export default TextAreaInput;
