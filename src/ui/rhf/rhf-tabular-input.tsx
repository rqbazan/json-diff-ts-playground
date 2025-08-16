import { Button, Field, IconButton, Input, Stack, Table } from "@chakra-ui/react";
import { Controller, useController, useFieldArray, useFormContext } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ControlledComponentProps, OptionalFieldValues } from "./types";

type Column = {
  key: string;
  title: string;
  required?: boolean;
};

type RHFTabularInputProps<T extends OptionalFieldValues> = ControlledComponentProps<T> & {
  columns: Column[];
};

export function RHFTabularInput<T extends OptionalFieldValues>({ name, columns }: RHFTabularInputProps<T>) {
  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { fields, append, remove } = useFieldArray<OptionalFieldValues>({
    name,
  });

  return (
    <Stack w="full">
      {fields.length > 0 && (
        <Table.ScrollArea borderWidth={1} rounded="md" maxH="160px" width="100%">
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.info">
                {columns.map((column) => (
                  <Table.ColumnHeader key={column.key}>{column.title}</Table.ColumnHeader>
                ))}
                <Table.ColumnHeader textAlign="end" />
              </Table.Row>
            </Table.Header>

            <Table.Body borderWidth={0}>
              {fields.map((arrayField, index) => {
                return (
                  <Table.Row key={arrayField.id}>
                    {columns.map((column) => (
                      <Table.Cell key={column.key} verticalAlign="top">
                        <Controller
                          render={({ field, fieldState }) => {
                            return (
                              <Field.Root invalid={fieldState.invalid}>
                                <Input size="xs" {...field} />
                                {fieldState.error?.message && (
                                  <Field.ErrorText fontSize="xs">{fieldState.error?.message}</Field.ErrorText>
                                )}
                              </Field.Root>
                            );
                          }}
                          name={`${name}.${index}.${column.key}`}
                          control={control}
                          rules={{ required: column.required ? "Required" : undefined }}
                        />
                      </Table.Cell>
                    ))}
                    <Table.Cell textAlign="end" verticalAlign="top">
                      <IconButton
                        colorPalette="red"
                        size="xs"
                        variant="outline"
                        onClick={() => remove(index)}
                        disabled={field.disabled}
                      >
                        <RiDeleteBin6Line />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )}

      <Button
        size="2xs"
        w="fit-content"
        variant="surface"
        disabled={field.disabled}
        onClick={() => {
          const defaultAddedObj = Object.fromEntries(columns.map((col) => [col.key, ""]));
          append(defaultAddedObj);
        }}
      >
        <LuPlus /> Add value
      </Button>
    </Stack>
  );
}
