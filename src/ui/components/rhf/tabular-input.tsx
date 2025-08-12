import { Button, IconButton, Input, Stack, Table } from "@chakra-ui/react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ControlledComponentProps, OptionalFieldValues } from "./types";

type Column = {
  key: string;
  title: string;
};

type RHFTabularInputProps<T extends OptionalFieldValues> = ControlledComponentProps<T> & {
  columns: Column[];
};

export function RHFTabularInput<T extends OptionalFieldValues>({ name, columns }: RHFTabularInputProps<T>) {
  const { control } = useFormContext();

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
              {fields.map((field, index) => {
                const columnKeys = columns.map((col) => col.key);

                return (
                  <Table.Row key={field.id}>
                    {columnKeys.map((columnKey) => (
                      <Table.Cell key={columnKey}>
                        <Controller
                          render={({ field }) => <Input size="xs" {...field} />}
                          name={`${name}.${index}.${columnKey}`}
                          control={control}
                        />
                      </Table.Cell>
                    ))}
                    <Table.Cell textAlign="end">
                      <IconButton size="xs" variant="outline" onClick={() => remove(index)}>
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
