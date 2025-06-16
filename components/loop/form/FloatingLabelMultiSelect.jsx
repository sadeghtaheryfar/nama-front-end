import React, { useState, useRef, useEffect } from 'react';
import useClickAway from './useClickAway'; // Correct import path for your custom hook

const FloatingLabelMultiSelect = ({
    placeholder,
    required = false,
    id = '',
    // !!! IMPORTANT: Receive 'field' prop directly from Controller
    field, // This 'field' prop now comes directly from the Controller
    errors,
    options = [], // options should be { value: string, label: string }
    disabled = false
}) => {
    // const { field } = control.register(name); // DELETE THIS LINE - It's incorrect here
    // The 'field' prop is already passed to this component by the Controller.

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Get the current value from React Hook Form's field
    // Ensure field.value is treated as an array for multi-select
    const selectedValues = Array.isArray(field.value) ? field.value : [];
    const isActive = isOpen || selectedValues.length > 0;
    const selectId = id || `multi-select-${placeholder.replace(/\s+/g, '-').toLowerCase()}`;

    // Get error for the specific field
    // The 'name' prop will be inside 'field.name'
    const fieldError = errors[field.name] || field.name.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            if (part.includes('[') && part.includes(']')) {
                const arrayKey = part.substring(0, part.indexOf('['));
                const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
                return acc[arrayKey]?.[index];
            }
            return acc[part];
        }
        return undefined;
    }, errors);

    useClickAway(containerRef, () => {
        setIsOpen(false);
    });

    const handleToggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionClick = (optionValue) => {
        const newSelectedValues = selectedValues.includes(optionValue)
            ? selectedValues.filter((val) => val !== optionValue)
            : [...selectedValues, optionValue];
        field.onChange(newSelectedValues); // Update React Hook Form value
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                id={selectId}
                onClick={handleToggleDropdown}
                className={`p-[1rem] border ${fieldError ? 'border-red-500' : 'border-[#EEEEEE]'} w-full rounded-[1rem] pt-[1.5rem] pb-[0.5rem] cursor-pointer min-h-[4rem] flex flex-wrap items-center gap-2 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                {/* The label for the floating effect */}
                <label
                    htmlFor={selectId}
                    className={`absolute transition-all duration-200 pointer-events-none ${fieldError ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-[#9796A1]'} ${
                        isActive
                            ? 'text-xs top-[0.5rem] right-[1rem]'
                            : 'text-base top-[1rem] right-[1rem]'
                    }`}
                >
                    {placeholder}
                    <span style={{ fontFamily: 'none', color: 'red' }}>{required ? ' *' : ''}</span>
                </label>

                {/* Placeholder when no values are selected and not active (label is at base position) */}
                {!isActive && (
                    <span className="text-base text-[#9796A1] opacity-0"> {/* Invisible span for spacing */}
                        {placeholder}
                        <span style={{ fontFamily: 'none', color: 'red' }}>{required ? ' *' : ''}</span>
                    </span>
                )}

                {/* Display selected tags */}
                {selectedValues.length > 0 && selectedValues.map((value) => {
                    const option = options.find(opt => opt.value === value);
                    return (
                        <span
                            key={value}
                            className="flex items-center bg-gray-200 rounded-md px-2 py-1 text-sm text-gray-700"
                        >
                            {option ? option.label : value}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent toggling dropdown
                                    handleOptionClick(value);
                                }}
                                className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                &times;
                            </button>
                        </span>
                    );
                })}

                {/* Hidden input to bind with React Hook Form's Controller field */}
                <input
                    type="hidden"
                    // Spread the field props to properly bind with React Hook Form
                    {...field}
                    // For multi-select, field.value will be an array. Controller handles serialization for form submission.
                    // If your backend specifically expects a comma-separated string, you might adjust onSubmit in form.jsx
                    // or convert here: value={selectedValues.join(',')}
                />

                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="#9796A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-[#EEEEEE] rounded-[1rem] shadow-lg max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-800 font-semibold' : ''
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            {fieldError && (
                <span className="text-red-500 text-xs mt-1 block">
                    {fieldError.message}
                </span>
            )}
        </div>
    );
};

export default FloatingLabelMultiSelect;