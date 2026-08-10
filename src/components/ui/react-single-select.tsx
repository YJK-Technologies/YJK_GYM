// import React from "react";
// import Select, { StylesConfig } from "react-select";

// export interface SingleSelectOption {
//   value: string;
//   label: string;
// }

// interface ReactSelectProps {
//   options: SingleSelectOption[];
//   value: SingleSelectOption | null;
//   onChange: (value: SingleSelectOption | null) => void;
//   placeholder?: string;
//   isDisabled?: boolean;
// }

// const customStyles: StylesConfig<SingleSelectOption, false> = {
//   control: (provided, state) => ({
//     ...provided,
//     minHeight: "40px",
//     borderRadius: "calc(var(--radius, 8px) - 2px)",
//     borderColor: "hsl(var(--input))",
//     backgroundColor: "hsl(var(--background))",
//     fontSize: "14px",
//     lineHeight: "20px",
//     padding: "0 4px",
//     boxShadow: state.isFocused
//       ? "0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))"
//       : "none",
//     outline: "none",
//     opacity: state.isDisabled ? 0.5 : 1,
//     cursor: state.isDisabled ? "not-allowed" : "default",
//     "&:hover": {
//       borderColor: "hsl(var(--input))",
//     },
//   }),

//   valueContainer: (provided) => ({
//     ...provided,
//     padding: "2px 8px",
//   }),

//   singleValue: (provided) => ({
//     ...provided,
//     color: "hsl(var(--foreground))",
//     fontSize: "14px",
//   }),

//   placeholder: (provided) => ({
//     ...provided,
//     color: "hsl(var(--foreground))",
//     fontSize: "14px",
//   }),

//   menu: (provided) => ({
//     ...provided,
//     backgroundColor: "hsl(var(--popover))",
//     color: "hsl(var(--popover-foreground))",
//     borderRadius: "calc(var(--radius, 8px) - 2px)",
//     border: "1px solid hsl(var(--border))",
//     boxShadow:
//       "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
//     overflow: "hidden",
//     zIndex: 9999,
//   }),

//   menuList: (provided) => ({
//     ...provided,
//     padding: "4px",
//   }),

//   option: (provided, state) => ({
//     ...provided,
//     fontSize: "14px",
//     borderRadius: "4px",
//     backgroundColor: state.isFocused
//       ? "hsl(var(--accent))"
//       : state.isSelected
//       ? "hsl(var(--muted))"
//       : "transparent",
//     color: state.isFocused
//       ? "hsl(var(--accent-foreground))"
//       : "hsl(var(--foreground))",
//     cursor: "pointer",
//     padding: "8px 10px",
//     "&:active": {
//       backgroundColor: "hsl(var(--accent))",
//     },
//   }),

//   indicatorSeparator: () => ({
//     display: "none",
//   }),

//   dropdownIndicator: (provided) => ({
//     ...provided,
//     color: "hsl(var(--foreground))",
//     opacity: 0.5,
//     padding: "8px",
//     "&:hover": {
//       color: "hsl(var(--foreground))",
//       opacity: 0.7,
//     },
//   }),

//   clearIndicator: (provided) => ({
//     ...provided,
//     color: "hsl(var(--muted-foreground))",
//     cursor: "pointer",
//     "&:hover": {
//       color: "hsl(var(--foreground))",
//     },
//   }),
// };

// const ReactSingleSelect: React.FC<ReactSelectProps> = ({
//   options,
//   value,
//   onChange,
//   placeholder,
//   isDisabled,
// }) => {
//   return (
//     <Select
//       options={options}
//       value={value}
//       onChange={(selected) => onChange(selected)}
//       styles={customStyles}
//       placeholder={placeholder}
//       isDisabled={isDisabled}
//       isClearable
//     />
//   );
// };

// export default ReactSingleSelect;

// react-single-select.tsx
import React from "react";
import Select, { StylesConfig } from "react-select";

export interface SingleSelectOption {
  value: string;
  label: string;
}

interface ReactSelectProps {
  id?: string;
  options: SingleSelectOption[];
  value: SingleSelectOption | null;
  onChange: (value: SingleSelectOption | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
}

const customStyles: StylesConfig<SingleSelectOption, false> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "40px",
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    borderColor: "hsl(var(--input))",
    backgroundColor: "hsl(var(--background))",
    fontSize: "14px",
    lineHeight: "20px",
    padding: "0 4px",
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
    padding: "2px 8px",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
    fontSize: "14px",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    fontSize: "14px",
  }),

  // Menu Floating Fix - Portal Styles
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Dropdown ellathukum mela top layer-la theriya
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--popover))",
    color: "hsl(var(--popover-foreground))",
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    border: "1px solid hsl(var(--border))",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    overflow: "hidden",
  }),

  menuList: (provided) => ({
    ...provided,
    padding: "4px",
    maxHeight: "200px",
  }),

  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    borderRadius: "4px",
    backgroundColor: state.isFocused
      ? "hsl(var(--accent))"
      : state.isSelected
      ? "hsl(var(--muted))"
      : "transparent",
    color: state.isFocused
      ? "hsl(var(--accent-foreground))"
      : "hsl(var(--foreground))",
    cursor: "pointer",
    padding: "8px 10px",
    "&:active": {
      backgroundColor: "hsl(var(--accent))",
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

  clearIndicator: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    cursor: "pointer",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),
};

const ReactSingleSelect: React.FC<ReactSelectProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  isClearable = true,
}) => {
  return (
    <Select
      id={id}
      options={options}
      value={value}
      onChange={(selected) => onChange(selected as SingleSelectOption | null)}
      styles={customStyles}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      // MAIN FIX: Portals the menu to document body so Card overflow doesn't clip it
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      menuPosition="fixed"
    />
  );
};

export default ReactSingleSelect;