import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import type { OptionalFieldValues } from "#/ui/components/rhf/types";

type RHFPersistProps = {
  persistKey: string;
};

export function createRHFPersist<T extends OptionalFieldValues>({ persistKey }: RHFPersistProps) {
  function RHFPersist() {
    const watchedValues = useWatch();

    const [, setStoredValues] = useLocalStorage<T>(persistKey, {} as T);

    useEffect(() => {
      setStoredValues(watchedValues as T);
    }, [watchedValues, setStoredValues]);

    return null;
  }

  function useRHFRestore() {
    const [storedValues] = useLocalStorage<T>(persistKey, {} as T);
    return storedValues;
  }

  return { RHFPersist, useRHFRestore };
}
