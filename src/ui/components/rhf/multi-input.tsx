import { Button, Field, HStack, IconButton, Input, type InputProps, Stack } from "@chakra-ui/react";
import { Controller, useController, useFieldArray, useFormContext } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ControlledComponentProps, OptionalFieldValues } from "./types";

export type RHFMultiInputProps<T extends OptionalFieldValues> = ControlledComponentProps<T> & InputProps;

export function RHFMultiInput<T extends OptionalFieldValues>({ name, label, required, ...props }: RHFMultiInputProps<T>) {
  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { fields, append, remove } = useFieldArray<OptionalFieldValues>({
    name,
  });

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>

      <Stack w="full">
        {fields.length > 0 && (
          <Stack gap={3}>
            {fields.map((arrayField, index) => (
              <HStack key={arrayField.id} alignItems="flex-start">
                <Controller
                  render={({ field, fieldState }) => {
                    return (
                      <Field.Root invalid={fieldState.invalid}>
                        <Input {...props} {...field} />
                        {fieldState.error?.message && <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>}
                      </Field.Root>
                    );
                  }}
                  name={`${name}.${index}.value`}
                  control={control}
                  rules={{ required: required ? "Required" : undefined }}
                />
                <IconButton
                  size="md"
                  colorPalette="red"
                  onClick={() => remove(index)}
                  aria-label="Delete input"
                  variant="outline"
                  disabled={field.disabled}
                >
                  <RiDeleteBin6Line />
                </IconButton>
              </HStack>
            ))}
          </Stack>
        )}
        <Button size="2xs" w="fit-content" variant="surface" onClick={() => append({ value: "" })} disabled={field.disabled}>
          <LuPlus /> Add value
        </Button>
      </Stack>
    </Field.Root>
  );
}
