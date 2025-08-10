import { Button, HStack, IconButton, Input, type InputProps, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

export type MultiInputProps = Omit<InputProps, "value" | "onChange"> & {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export type MultiInputLineProps = InputProps & {
  enableDelete: boolean;
  onDelete: () => void;
};

export function MultiInput(props: MultiInputProps) {
  const [values, setValues] = useState<string[]>(props.value ?? [""]);

  return (
    <Stack w="full">
      {Array.isArray(values) && values.length > 0 && (
        <Stack gap={3}>
          {values.map((value, index) => (
            <HStack // biome-ignore lint/suspicious/noArrayIndexKey: use index for simplicity
              key={index}
            >
              <Input
                {...props}
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setValues((prev) => {
                    const newValues = [...prev];
                    newValues[index] = newValue;
                    return newValues;
                  });
                }}
              />
              <IconButton
                size="md"
                onClick={() => {
                  setValues((prev) => prev.filter((_, i) => i !== index));
                }}
                aria-label="Delete input"
                variant="outline"
              >
                <RiDeleteBin6Line />
              </IconButton>
            </HStack>
          ))}
        </Stack>
      )}
      <Button size="2xs" w="fit-content" variant="surface" onClick={() => setValues((prev) => [...prev, ""])}>
        <LuPlus /> Add value
      </Button>
    </Stack>
  );
}
