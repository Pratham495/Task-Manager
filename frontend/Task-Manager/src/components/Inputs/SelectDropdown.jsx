import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative mt-2 w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black bg-white border border-slate-200 px-3 py-2.5 rounded-md flex justify-between items-center shadow-sm hover:border-slate-300 transition"
      >
        <span>
          {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        </span>
        <LuChevronDown
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                value === option.value ? "bg-gray-50 font-semibold" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
