import { useLocalStorage } from "@uidotdev/usehooks";
import { useState } from "react";
import { isValidJson } from "#/utils/json-functions";

export function useJsonEditorState(baseKey: string, initialValue: string | undefined) {
  const [isInitialValid] = useState(() => (initialValue ? isValidJson(initialValue) : true));

  const [value, setValue] = useLocalStorage(`${baseKey}_value`, initialValue);
  const [isValid, setIsValid] = useLocalStorage<boolean>(`${baseKey}_is_valid`, isInitialValid);

  return { value, setValue, isValid, setIsValid };
}
