import { Button, Field, HStack, IconButton, Input, type InputProps, Stack } from "@chakra-ui/react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ControlledComponentProps, OptionalFieldValues } from "./types";

export type RHFMultiInputProps<T extends OptionalFieldValues> = ControlledComponentProps<T> & InputProps;

export function RHFMultiInput<T extends OptionalFieldValues>({ name, label, ...props }: RHFMultiInputProps<T>) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray<OptionalFieldValues>({
    name,
  });

  return (
    <Field.Root>
      <Field.Root>
        <Field.Label>{label}</Field.Label>

        <Stack w="full">
          {fields.length > 0 && (
            <Stack gap={3}>
              {fields.map((field, index) => (
                <HStack key={field.id}>
                  <Controller
                    render={({ field }) => <Input {...field} {...props} />}
                    name={`${name}.${index}.value`}
                    control={control}
                  />
                  <IconButton size="md" onClick={() => remove(index)} aria-label="Delete input" variant="outline">
                    <RiDeleteBin6Line />
                  </IconButton>
                </HStack>
              ))}
            </Stack>
          )}
          <Button size="2xs" w="fit-content" variant="surface" onClick={() => append({ value: "" })}>
            <LuPlus /> Add value
          </Button>
        </Stack>
      </Field.Root>
    </Field.Root>
  );
}
