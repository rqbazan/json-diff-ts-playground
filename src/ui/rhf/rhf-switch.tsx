import { Field } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { Switch } from "#/ui/core/switch";
import type { ControlledComponentProps, OptionalFieldValues } from "./types";

export type RHFSwitchProps<T extends OptionalFieldValues> = ControlledComponentProps<T>;

export function RHFSwitch<T extends OptionalFieldValues>({ name, label, ...props }: RHFSwitchProps<T>) {
  const { field } = useController({
    name,
  });

  return (
    <Field.Root>
      <Switch {...props} {...field}>
        {label ? <Field.Label>{label}</Field.Label> : null}
      </Switch>
    </Field.Root>
  );
}
