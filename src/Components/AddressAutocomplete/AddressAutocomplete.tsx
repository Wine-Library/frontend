import { useState, useEffect, useRef } from "react";
import { useCombobox } from "downshift";
import s from "./AddressAutocomplete.module.scss";
import clsx from "clsx";

interface AddressSuggestion {
  display_name: string;
}

export const AddressAutocomplete = ({
  initialValue,
  onSelect,
}: {
  initialValue: string;
  onSelect: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (inputValue.length < 3) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(inputValue)}`
      );
      setSuggestions(await res.json());
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox<AddressSuggestion>({
    items: suggestions,
    inputValue,
    itemToString: (item) => item?.display_name ?? "",
    onInputValueChange: ({ inputValue: newValue }) => {
      setInputValue(newValue ?? "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) onSelect(selectedItem.display_name);
    },
  });

  const showList = isOpen && inputValue.length >= 3;

  return (
    <div className={s.addressAutocomplete}>
      <div className={s.addressInputWrap}>
        <span className={s.addressSpan}>
          SHIPPING ADDRESS
        </span>
        <input
          {...getInputProps({
            placeholder: "Shipping address",
            className: s.addressAutocompleteInput,
            required: true,
            onBlur: () => onSelect(inputValue),
          })}
        />
      </div>
      <ul {...getMenuProps()} className={clsx(s.addressAutocompleteList, showList && s.addressAutocompleteListActive)}>
        {showList && suggestions.length === 0 && (
          <li className={s.addressAutocompleteItem}>No matching addresses found</li>
        )}
        {showList &&
          suggestions.map((item, index) => (
            <li
              key={index}
              className={clsx(s.addressAutocompleteItem, highlightedIndex === index && s.addressAutocompleteItemActive)}
              {...getItemProps({ item, index })}
            >
              {item.display_name}
            </li>
          ))}
      </ul>
    </div>
  );
}
