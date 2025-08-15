import type { FieldValues, Path } from "react-hook-form";

export type OptionalFieldValues = Partial<FieldValues>;

export type ControlledComponentProps<T extends OptionalFieldValues> = {
  name: Path<T>;
  required?: boolean;
  label?: string;
  helperText?: string;
};
