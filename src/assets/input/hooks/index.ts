import React, { useState, useEffect, useRef, useCallback } from "react";
import type { TransformedInput } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyDownHandler = (currentValue: string, props?: TransformedInput) => any;

export interface InputHookConfig {
  /** Time in ms to wait before formatting the user input for normal keys */
  formatDelay?: number;

  /** Symbol to be used for decimal point */
  decimalSymbol?: string;

  /** Affix to append to value - does not save to model and is only for display on input */
  prefix?: string;

  /** Affix to prepend to value - does not save to model and is only for display on input */
  suffix?: string;
}

/** Create a valid config mixing in defaults and user overrides */
export const getConfig = (
  userConfig: InputHookConfig = {},
): Required<InputHookConfig> => {
  return {
    decimalSymbol: ".",
    formatDelay: 200,
    prefix: "",
    suffix: "",
    ...userConfig,
  };
};

/**
 * A hook to manage an input html element as an asset.
 * The hook returns an object containing props that are expected to reside on any html input.
 * It will handle formatting, setting values, beaconing, aria-labels, etc.
 *
 * @param props - The output of the input transform
 * @param config - Local config to manage user interaction overrides
 */
export const useInputProps = (
  props: TransformedInput,
  config?: InputHookConfig,
) => {
  const [localValue, setLocalValue] = useState(props.value ?? "");
  const formatTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { formatDelay, decimalSymbol, prefix, suffix } = getConfig(config);

  /** Reset and pending format timers */
  function clearPending() {
    if (formatTimerRef.current) {
      clearTimeout(formatTimerRef.current);
      formatTimerRef.current = undefined;
    }
  }

  /** Affix handling logic on focus */
  function handleAffixOnFocus(target: HTMLInputElement) {
    let val = target.value;

    if (suffix) val = val.substring(0, val.indexOf(suffix));

    if (prefix && !val.includes(prefix)) {
      val = `${prefix}${val}`;
    }

    return val;
  }

  /** Edge cases handling for prefix */
  function handlePrefixEdgeCases(e: React.KeyboardEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const pl = prefix.length;
    const atStart = start === pl;
    const atEnd = end === pl;

    if (start && end && start < pl) {
      e.preventDefault();
      target.setSelectionRange(pl, end - start + pl);
    } else if (
      (e.key === "ArrowLeft" && atStart) ||
      (e.key === "Backspace" && atStart && atEnd) ||
      e.key === "Home"
    ) {
      e.preventDefault();
      target.setSelectionRange(prefix.length, prefix.length);
    }
  }

  /** Helper to add affixes to value where appropriate  */
  const formatValueWithAffix = useCallback(
    (value: string | undefined) => (value ? `${prefix}${value}${suffix}` : ""),
    [prefix, suffix],
  );

  /** Value handling logic on key down */
  const onKeyDownHandler: KeyDownHandler = (currentValue: string) => {
    const symbolPosition = currentValue.indexOf(decimalSymbol);
    const newValue = props.format(currentValue) ?? "";
    const newSymbolPosition = newValue.indexOf(decimalSymbol);

    if (
      (symbolPosition === -1 || symbolPosition === 0) &&
      newSymbolPosition > 0
    ) {
      // formatting added dot, so set cursor before dot
      return {
        newValue: newValue.includes(prefix)
          ? `${newValue}`
          : `${prefix}${newValue}`,
        newCursorPosition: newValue.includes(prefix)
          ? newSymbolPosition
          : newSymbolPosition + prefix.length,
      };
    }

    return {
      newValue: newValue.includes(prefix)
        ? `${newValue}`
        : `${prefix}${newValue}`,
    };
  };

  /** On blur, commit the value to the model */
  const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    clearPending();

    const formatted =
      (prefix
        ? e.target.value.replace(prefix, "")
        : props.format(e.target.value)) ?? "";

    if (formatted) {
      props.set(formatted);
      setLocalValue(formatValueWithAffix(formatted));
    } else {
      props.set("");
      setLocalValue("");
    }
  };

  /** Keep track of any user changes */
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setLocalValue(e.target.value);
  };

  /** Schedule a format of the current input in the future */
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    clearPending();

    if (prefix) handlePrefixEdgeCases(e);

    const target = e.target as HTMLInputElement;

    formatTimerRef.current = setTimeout(() => {
      const cursorPosition = target.selectionStart;
      const currentValue = target.value;

      /** Skip formatting if we're in the middle of the input */
      if (cursorPosition !== currentValue.length) {
        return;
      }

      const obj = onKeyDownHandler(currentValue);

      setLocalValue(obj.newValue);
      target.selectionStart = obj.newCursorPosition ?? target.selectionStart;
      target.selectionEnd = obj.newCursorPosition ?? target.selectionEnd;
    }, formatDelay);
  };

  /** Format value onFocus if affixes exist */
  const onFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const inputEmpty = target.value === "";

    if ((!inputEmpty && suffix) || (inputEmpty && prefix)) {
      setLocalValue(handleAffixOnFocus(target));
    }
  };

  // Update the stored value if data changes
  const propsValue = props.value;
  useEffect(() => {
    setLocalValue(formatValueWithAffix(propsValue));
  }, [formatValueWithAffix, propsValue]);

  /** clear anything pending on unmount of input */
  useEffect(() => clearPending, []);

  return {
    onBlur,
    onChange,
    onKeyDown,
    onFocus,
    value: localValue,
  };
};
