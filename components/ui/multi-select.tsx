import React, { useState } from 'react';
import { ChevronUp,ChevronDown, X } from 'lucide-react';

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function MultiSelect({ options, selected, onChange, className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    const updatedSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(updatedSelected);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.map((value) => (
          <span key={value} className="bg-gray-200 px-2 py-1 rounded-md flex items-center">
            {options.find((option) => option.value === value)?.label}
            <X
              size={14}
              className="ml-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(value);
              }}
            />
          </span>
        ))}
        { isOpen ? <ChevronUp className="ml-auto" /> : <ChevronDown className="ml-auto" /> }
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selected.includes(option.value) ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleToggle(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}