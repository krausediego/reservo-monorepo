type ItemMeta = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AutocompleteCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  selectedValue: string | null;
  selectedLabel: string | null;
  highlightedValue: string | null;
  setHighlightedValue: (v: string | null) => void;
  disabled: boolean;
  inputWrapperRef: React.RefObject<HTMLDivElement>;
};
