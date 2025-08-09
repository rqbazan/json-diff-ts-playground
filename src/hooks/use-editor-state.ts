import { useLocalStorage } from "@uidotdev/usehooks";

export function useEditorState(baseKey: string, initialValue: string | undefined) {
  const [value, setValue] = useLocalStorage(`${baseKey}_value`, initialValue);
  const [isValid, setIsValid] = useLocalStorage<boolean>(`${baseKey}_is_valid`, true);

  return { value, setValue, isValid, setIsValid };
}
