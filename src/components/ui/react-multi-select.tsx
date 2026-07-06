import React from "react";
import Select, { StylesConfig } from "react-select";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface ReactMultiSelectProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

// Shadcn design ku match aagura mathiri react-select custom styles
const customStyles: StylesConfig<MultiSelectOption, true> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "40px",
    borderRadius: "calc(var(--radius, 8px) - 2px)", // shadcn rounded-md
    borderColor: "hsl(var(--input))",
    backgroundColor: "hsl(var(--background))",
    fontSize: "14px",
    lineHeight: "20px",
    padding: "0 4px",
    // Shadcn focus state ring mechanics
    boxShadow: state.isFocused
      ? "0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))"
      : "none",
    outline: "none",
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? "not-allowed" : "default",
    "&:hover": {
      borderColor: "hsl(var(--input))",
    },
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "2px 4px",
    gap: "4px",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    fontSize: "14px",
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--popover))",
    color: "hsl(var(--popover-foreground))",
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    border: "1px solid hsl(var(--border))",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // shadow-md
    overflow: "hidden",
    zIndex: 9999,
  }),

  menuList: (provided) => ({
    ...provided,
    padding: "4px", // shadcn p-1 viewport padding
  }),

  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    borderRadius: "4px", // shadcn rounded-sm
    backgroundColor: state.isFocused
      ? "hsl(var(--accent))"
      : state.isSelected
      ? "hsl(var(--muted))"
      : "transparent",
    color: state.isFocused 
      ? "hsl(var(--accent-foreground))" 
      : "hsl(var(--foreground))",
    cursor: "default",
    padding: "6px 8px 6px 32px", // Left padding extra for checkmark simulation space
    position: "relative",
    "&:active": {
      backgroundColor: "hsl(var(--accent))",
    },
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--secondary))",
    color: "hsl(var(--secondary-foreground))",
    borderRadius: "4px",
    alignItems: "center",
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
    fontSize: "12px",
    paddingLeft: "6px",
    paddingRight: "6px",
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
    opacity: 0.7,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      opacity: 1,
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
    opacity: 0.5,
    padding: "8px",
    "&:hover": {
      color: "hsl(var(--foreground))",
      opacity: 0.7,
    },
  }),
};

const ReactMultiSelect: React.FC<ReactMultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
}) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={(selected) => onChange(selected as MultiSelectOption[])}
      styles={customStyles}
      placeholder={placeholder}
      isDisabled={isDisabled}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
    />
  );
};

export default ReactMultiSelect;