"use client";

import { useForm } from "react-hook-form";

function TextInput({
  label,
  name,
  isRequired = true,
  register,
  errors,
  type = "text",
  className = "sm:col-span-2",
  validation = {},
  placeholder,
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
      if (error?.type === 'min') {
        return `${label} must be at least ${validation.min}`;
      }
      if (error?.type === 'max') {
        return `${label} must be less than ${validation.max}`;
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
          className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="mt-2">
          <input
            {...register(`${name}`, defaultValidation)}
            type={type}
            name={name}
            id={name}
            autoComplete={name}
            className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${
              errors[`${name}`] 
                ? 'ring-red-300 focus:ring-red-500' 
                : 'ring-gray-300'
            }`}
            placeholder={placeholder || `Type the ${label}`}
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

  // If no register, use normal input
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
      >
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        <input
          type={type}
          name={name}
          id={name}
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          autoComplete={name}
          className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${
            error 
              ? 'ring-red-300 focus:ring-red-500' 
              : 'ring-gray-300'
          }`}
          placeholder={placeholder || `Type the ${label}`}
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

export default TextInput;
