import { Button, IconButton, Input, Stack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

type BaseData = Record<string, string>;

type TabularInputProps<TData extends BaseData> = {
  defaultValue: TData;
  value?: TData[];
  onChange?: (value: TData[]) => void;
};

export function TabularInput<TData extends BaseData>({ value, defaultValue }: TabularInputProps<TData>) {
  const [values, setValues] = useState<TData[]>(value ?? [defaultValue]);

  return (
    <Stack w="full">
      {Array.isArray(values) && values.length > 0 && (
        <Table.ScrollArea borderWidth={1} rounded="md" maxH="160px" width="100%">
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.info">
                <Table.ColumnHeader>Key</Table.ColumnHeader>
                <Table.ColumnHeader>Id</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end" />
              </Table.Row>
            </Table.Header>

            <Table.Body borderWidth={0}>
              {values.map((item, index) => {
                const itemKeys = Object.keys(item);

                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: index for simplicity
                  <Table.Row key={index}>
                    {itemKeys.map((key) => (
                      <Table.Cell key={key}>
                        <Input
                          size="xs"
                          value={item[key]}
                          onChange={(e) => {
                            const targetValue = e.target.value;

                            setValues((prev) => {
                              const newValues = [...prev];

                              newValues[index] = {
                                ...newValues[index],
                                [key]: targetValue,
                              } as TData;

                              return newValues;
                            });
                          }}
                        />
                      </Table.Cell>
                    ))}
                    <Table.Cell textAlign="end">
                      <IconButton
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setValues((prev) => prev.filter((_, i) => i !== index));
                        }}
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
      <Button size="2xs" w="fit-content" variant="surface" onClick={() => setValues((prev) => [...prev, defaultValue])}>
        <LuPlus /> Add value
      </Button>
    </Stack>
  );
}
