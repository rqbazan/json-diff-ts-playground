import { Field, Fieldset, HStack, IconButton, Stack } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { RHFMultiInput } from "#/ui/components/rhf/multi-input";
import { RHFSwitch } from "#/ui/components/rhf/switch";
import { RHFTabularInput } from "#/ui/components/rhf/tabular-input";
import { Switch } from "#/ui/components/switch";

export type OptionsFieldsetProps = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
};

export type OptionsFormInputs = {
  keysToSkip?: { value: string }[];
  embeddedObjKeys?: { key: string; id: string }[];
  treatTypeChangeAsReplace?: boolean;
};

export function OptionsFieldset({ enabled, onEnabledChange }: OptionsFieldsetProps) {
  return (
    <Fieldset.Root p={3} size="lg">
      <HStack w="full">
        <Stack gap={0}>
          <Fieldset.Legend>Options</Fieldset.Legend>
          <Fieldset.HelperText display="flex" gap={1} alignItems="center">
            Diff algorithm options
            <IconButton asChild variant="ghost" size="2xs" rounded="full">
              <a
                href="https://github.com/ltwlf/json-diff-ts/blob/95865cbdd641cb74616f3bdefe6667eb94c58a9e/README.md#options-interface"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuInfo />
              </a>
            </IconButton>
          </Fieldset.HelperText>
        </Stack>
        <Stack ml="auto">
          <Switch checked={enabled} onCheckedChange={(e) => onEnabledChange(e.checked)} />
        </Stack>
      </HStack>

      <Fieldset.Content mt={4}>
        <Field.Root>
          <Field.Label>Keys to skip</Field.Label>
          <RHFMultiInput name="keysToSkip" placeholder="some.nested.key" required />
        </Field.Root>

        <Field.Root>
          <Field.Label>Embedded object keys</Field.Label>

          <RHFTabularInput
            name="embeddedObjKeys"
            columns={[
              { key: "key", title: "Key", required: true },
              { key: "id", title: "ID", required: true },
            ]}
          />
        </Field.Root>

        <RHFSwitch name="treatTypeChangeAsReplace" label="Treat type change as replace" />
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
