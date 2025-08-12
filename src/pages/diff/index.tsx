import { Box, Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { HiCheck } from "react-icons/hi2";
import { useEditorState } from "../../hooks/use-editor-state";
import { useTimeoutedState } from "../../hooks/use-timeouted-state";
import { jsonDiff } from "../../lib/json-diff";
import { SAMPLE_ID, type SampleId, sampleCollection, samples } from "../../samples";
import { CodeBlock } from "../../ui/components/code-block";
import { JsonEditor } from "../../ui/components/json-editor";
import { SectionHeading } from "../../ui/components/section-heading";
import * as Select from "../../ui/components/select";
import { toaster } from "../../ui/components/toaster";
import { texts } from "../../ui/wording";
import { fromJSON, toJSON } from "../../utils/functions";
import { OptionsForm, type OptionsFormProps } from "./options-form";

export function DiffPage() {
  const [diffExecuted, setDiffExecuted] = useTimeoutedState(false);

  const [selectedSamplesId, setSelectedSamplesId] = useLocalStorage<string[]>("diff_selected_samples", [SAMPLE_ID.SIMPLE]);

  const [selectedSampleId] = selectedSamplesId;

  const initialSample = useMemo(() => {
    return selectedSampleId ? samples[selectedSampleId as SampleId] : undefined;
  }, [selectedSampleId]);

  const sourceEditorState = useEditorState("diff_source_editor", initialSample?.sourceString);
  const targetEditorState = useEditorState("diff_target_editor", initialSample?.targetString);

  const [changesString, setChangesString] = useState(() => {
    const diff = jsonDiff(fromJSON(sourceEditorState.value), fromJSON(targetEditorState.value));

    return toJSON(diff);
  });

  function executeDiff(sourceString: string, targetString: string) {
    const diff = jsonDiff(fromJSON(sourceString), fromJSON(targetString));

    setChangesString(toJSON(diff));
  }

  function onEditorChange(editorState: ReturnType<typeof useEditorState>, value: string | undefined) {
    editorState.setValue(value ?? "");
    setSelectedSamplesId([]);
  }

  function onSampleSelectionChange(selection: string[]) {
    setSelectedSamplesId(selection);

    const selectedSample = samples[selection[0] as SampleId];
    const { sourceString, targetString } = selectedSample;

    sourceEditorState.setValue(sourceString);
    targetEditorState.setValue(targetString);

    executeDiff(sourceString, targetString);
  }

  const onExecuteIntent: OptionsFormProps["onSubmit"] = (formInputs) => {
    console.log({ formInputs });

    if (!sourceEditorState.isValid) {
      toaster.create({
        title: "Invalid Source JSON",
        type: "error",
        description: "Please fix any JSON validation errors before executing the diff.",
      });
      return;
    }

    if (!targetEditorState.isValid) {
      toaster.create({
        title: "Invalid Target JSON",
        type: "error",
        description: "Please fix any JSON validation errors before executing the diff.",
      });
      return;
    }

    executeDiff(sourceEditorState.value, targetEditorState.value);

    setDiffExecuted(true);
  };

  return (
    <Flex direction="column" flex={1}>
      <Flex flex={1}>
        <Flex direction="column" h="full" w="50%">
          <SectionHeading title={texts["diff.source.title"]} description={texts["diff.source.description"]} />
          <JsonEditor
            value={sourceEditorState.value}
            onChange={(value) => onEditorChange(sourceEditorState, value)}
            onValidate={(markers) => sourceEditorState.setIsValid(markers.length === 0)}
          />
        </Flex>

        <Separator orientation="vertical" size="md" />

        <Flex direction="column" h="full" w="50%">
          <SectionHeading title={texts["diff.target.title"]} description={texts["diff.target.description"]} />
          <JsonEditor
            value={targetEditorState.value}
            onChange={(value) => onEditorChange(targetEditorState, value)}
            onValidate={(markers) => sourceEditorState.setIsValid(markers.length === 0)}
          />
        </Flex>
      </Flex>

      <Separator size="md" />

      <Flex flex={1}>
        <Flex direction="column" h="full" w="30%" borderRight="2px" borderColor="gray.800">
          <SectionHeading title={texts["diff.config.title"]} description={texts["diff.config.description"]} />

          <Box flex={1} position="relative">
            <Box position="absolute" inset={0} overflow="auto">
              <Select.SelectRoot
                p={3}
                collection={sampleCollection}
                value={selectedSamplesId}
                onValueChange={(e) => onSampleSelectionChange(e.value)}
              >
                <Select.SelectLabel>JSON Samples</Select.SelectLabel>
                <Select.SelectTrigger>
                  <Select.SelectValueText placeholder="Select Sample" />
                </Select.SelectTrigger>
                <Select.SelectContent>
                  {sampleCollection.items.map((item) => (
                    <Select.SelectItem key={item.value} item={item}>
                      {item.label}
                    </Select.SelectItem>
                  ))}
                </Select.SelectContent>
              </Select.SelectRoot>

              <Separator />

              <OptionsForm id="diff-options-form" onSubmit={onExecuteIntent} />
            </Box>
          </Box>

          <Separator />

          <Stack mt="auto" p={3}>
            <Button size="sm" form="diff-options-form" type="submit">
              {diffExecuted && <HiCheck />} Execute Diff
            </Button>
          </Stack>
        </Flex>

        <Separator orientation="vertical" size="md" />

        <Flex direction="column" h="full" w="70%">
          <SectionHeading title={texts["diff.output.title"]} description={texts["diff.output.description"]} />

          <Box flex={1} position="relative">
            <Box position="absolute" inset={0} overflow="auto">
              <CodeBlock lang="json" code={changesString} />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
