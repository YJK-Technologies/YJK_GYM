import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

interface Option {
  TrainerID: string;
  FullName: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select trainers...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((val) => val !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-10 w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm ring-offset-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="flex flex-wrap gap-1 items-center">
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 select-none">{placeholder}</span>
          ) : (
            selectedValues.map((id) => {
              const matched = options.find((opt) => opt.TrainerID === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200 max-w-xs truncate"
                >
                  {id} - {matched?.FullName || "Trainer"}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents dropdown from opening/closing
                      toggleOption(id);
                    }}
                    className="ml-0.5 text-blue-500 hover:text-blue-800 font-bold"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-50 duration-100">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.TrainerID);
            return (
              <div
                key={option.TrainerID}
                onClick={() => toggleOption(option.TrainerID)}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-gray-100 text-gray-700 justify-between"
              >
                <span className={`${isSelected ? "font-medium text-gray-900" : ""}`}>
                  {option.TrainerID} - {option.FullName}
                </span>
                {isSelected && <Check className="h-4 w-4 text-blue-600 font-bold shrink-0" />}
              </div>
            );
          })}
          {options.length === 0 && (
            <div className="py-3 px-3 text-sm text-gray-400 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};