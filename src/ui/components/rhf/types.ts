import type { FieldValues, Path } from "react-hook-form";

export type OptionalFieldValues = Partial<FieldValues>;

export type ControlledComponentProps<T extends OptionalFieldValues> = {
  name: Path<T>;
  label?: string;
  helperText?: string;
};
