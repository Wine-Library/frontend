import { useState, useEffect, useRef } from "react";
import { useCombobox } from "downshift";
import s from "./AddressAutocomplete.module.scss";
import clsx from "clsx";

// Subset of the object Nominatim returns when `addressdetails=1` is requested.
interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  path?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  county?: string;
  postcode?: string;
}

interface AddressSuggestion {
  display_name: string;
  address?: NominatimAddress;
}

export interface AddressSelection {
  street: string;
  city: string;
  postCode: string;
  /** The full formatted label Nominatim returned, kept for reference. */
  full: string;
}

// Collapses Nominatim's granular address fields into the three the app stores.
function toSelection(item: AddressSuggestion): AddressSelection {
  const a = item.address ?? {};
  const road =
    a.road ?? a.pedestrian ?? a.footway ?? a.path ?? a.neighbourhood ?? "";
  const street = [a.house_number, road].filter(Boolean).join(" ");
  const city =
    a.city ?? a.town ?? a.village ?? a.municipality ?? a.suburb ?? a.county ?? "";
  return { street, city, postCode: a.postcode ?? "", full: item.display_name };
}

export const AddressAutocomplete = ({
  initialValue,
  onSelect,
}: {
  initialValue: string;
  onSelect: (selection: AddressSelection) => void;
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Whether the current input text came from picking a suggestion — so a blur
  // doesn't clobber the parsed parts with the raw search string.
  const pickedRef = useRef(false);

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
      pickedRef.current = false;
      setInputValue(newValue ?? "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        pickedRef.current = true;
        onSelect(toSelection(selectedItem));
      }
    },
  });

  const showList = isOpen && inputValue.length >= 3;

  return (
    <div className={s.addressAutocomplete}>
      <div className={s.addressInputWrap}>
        <span className={s.addressSpan}>
          FIND ADDRESS
        </span>
        <input
          {...getInputProps({
            placeholder: "Start typing your address",
            className: s.addressAutocompleteInput,
            onBlur: () => {
              if (!pickedRef.current && inputValue.trim()) {
                onSelect({ street: inputValue, city: "", postCode: "", full: inputValue });
              }
            },
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
