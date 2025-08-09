import { useRef, useState } from "react";

export function useTimeoutedState<T>(initialValue: T, timeout: number = 700) {
  const [value, setValue] = useState(initialValue);
  const timerId = useRef<number | null>(null);

  const setTimeoutedValue = (newValue: T) => {
    if (timerId.current !== null) {
      clearTimeout(timerId.current);
    }

    setValue(newValue);

    timerId.current = setTimeout(() => {
      setValue(initialValue);
    }, timeout);
  };

  return [value, setTimeoutedValue] as const;
}
