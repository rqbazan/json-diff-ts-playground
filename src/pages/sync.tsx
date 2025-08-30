import { Alert, Box, Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useJsonEditorState } from "#/hooks/use-json-editor-state";
import { jsonDiff, jsonSync } from "#/lib/json-diff";
import { SAMPLE_ID, type SampleId, sampleCollection, samples } from "#/samples";
import { JsonEditor } from "#/ui/app/json-editor";
import { OptionsFieldset, type OptionsFormInputs } from "#/ui/app/options-fieldset";
import { OutputBox } from "#/ui/app/output-box";
import { PanelsLayout } from "#/ui/app/panels-layout";
import { SectionHeading } from "#/ui/app/section-heading";
import * as Select from "#/ui/core/select";
import { toaster } from "#/ui/toaster";
import { texts } from "#/ui/wording";
import {
  convertToOptionsFormInputs,
  type DiffOrSyncInput,
  getDefaultOptionsFormInputs,
  getDiffString,
  getTargetString,
} from "#/utils/diff-sync";
import { fromJSON, toJSON } from "#/utils/json-functions";

export function SyncPage() {
  const [syncExecuted, setSyncExecuted] = useState(false);

  const [selectedSamplesId, setSelectedSamplesId] = useLocalStorage<string[]>("sync_selected_samples", [SAMPLE_ID.SIMPLE]);

  const [selectedSampleId] = selectedSamplesId;

  const initialSample = useMemo(() => {
    return selectedSampleId ? samples[selectedSampleId as SampleId] : undefined;
  }, [selectedSampleId]);

  const initialChangesString = useMemo(() => {
    if (initialSample) {
      return getDiffString(initialSample.source, initialSample.target, initialSample.diffOptions);
    }
  }, [initialSample]);

  const sourceEditorState = useJsonEditorState("sync_source_editor", initialSample?.sourceString);
  const changesEditorState = useJsonEditorState("sync_changes_editor", initialChangesString);

  const [targetString, setTargetString] = useState(() => {
    try {
      const target = jsonSync(fromJSON(sourceEditorState.value), fromJSON(changesEditorState.value));
      return toJSON(target);
    } catch (error) {
      console.error("Error initializing target string:", error);
      return "";
    }
  });

  const [enabledDiffOptions, setEnableDiffOptions] = useLocalStorage<boolean>(
    "sync_enabled_options",
    initialSample?.diffOptions !== undefined,
  );

  const defaultValues = initialSample?.diffOptions
    ? convertToOptionsFormInputs(initialSample.diffOptions)
    : getDefaultOptionsFormInputs();

  const form = useForm<OptionsFormInputs>({
    disabled: true,
    defaultValues,
  });

  function executeSync(source: DiffOrSyncInput, changes: DiffOrSyncInput) {
    try {
      setTargetString(getTargetString(source, changes));
    } catch (error) {
      console.error("Error executing sync:", error);

      toaster.create({
        title: "Sync Error",
        type: "error",
        description: "An error occurred while executing the sync.",
      });
    }
  }

  async function executeSyncAsync(source: DiffOrSyncInput, changes: DiffOrSyncInput) {
    try {
      setSyncExecuted(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // simulate async operation
      executeSync(source, changes);
    } catch (error) {
      console.error("Can't execute sync successfully", error);
    } finally {
      setSyncExecuted(false);
    }
  }

  function onEditorChange(editorState: ReturnType<typeof useJsonEditorState>, value: string | undefined) {
    editorState.setValue(value ?? "");
    setSelectedSamplesId([]);
  }

  async function onSampleSelectionChange(selection: string[]) {
    setSelectedSamplesId(selection);

    const selectedSample = samples[selection[0] as SampleId];
    const { source, target, diffOptions, sourceString } = selectedSample;

    const changes = jsonDiff(source, target, diffOptions);

    sourceEditorState.setValue(sourceString);
    changesEditorState.setValue(toJSON(changes));

    if (diffOptions) {
      form.reset(convertToOptionsFormInputs(diffOptions));
      setEnableDiffOptions(true);
    } else {
      form.reset(getDefaultOptionsFormInputs());
      setEnableDiffOptions(false);
    }

    await executeSyncAsync(source, changes);
  }

  async function onExecuteSyncClick() {
    if (!sourceEditorState.isValid) {
      toaster.create({
        title: "Invalid Source JSON",
        type: "error",
        description: "Please fix any JSON validation errors before executing the sync.",
      });
      return;
    }

    if (!changesEditorState.isValid) {
      toaster.create({
        title: "Invalid Changes",
        type: "error",
        description: "Please fix any JSON validation errors before executing the sync.",
      });
      return;
    }

    await executeSyncAsync(sourceEditorState.value, changesEditorState.value);
  }

  return (
    <PanelsLayout
      autoSavePreffixId="sync-page"
      topLeftContent={
        <Flex direction="column" h="full">
          <SectionHeading title={texts["diff.source.title"]} description={texts["diff.source.description"]} />
          <JsonEditor
            value={sourceEditorState.value}
            onChange={(value) => onEditorChange(sourceEditorState, value)}
            onValidate={(markers) => sourceEditorState.setIsValid(markers.length === 0)}
          />
        </Flex>
      }
      topRightContent={
        <Flex direction="column" h="full">
          <SectionHeading title={texts["sync.changes.title"]} description={texts["sync.changes.description"]} />
          <JsonEditor
            value={changesEditorState.value}
            onChange={(value) => onEditorChange(changesEditorState, value)}
            onValidate={(markers) => sourceEditorState.setIsValid(markers.length === 0)}
          />
        </Flex>
      }
      bottomLeftContent={
        <Flex direction="column" h="full">
          <SectionHeading title={texts["sync.config.title"]} description={texts["sync.config.description"]} />

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

              {enabledDiffOptions && (
                <>
                  <Separator />
                  <FormProvider {...form}>
                    <OptionsFieldset readonly />
                  </FormProvider>
                </>
              )}
            </Box>
          </Box>

          <Stack mt="auto" p={3}>
            <Button
              size="sm"
              onClick={onExecuteSyncClick}
              bgColor="green.400"
              color="black"
              _dark={{ bgColor: "blue.700", color: "white" }}
              _hover={{ bgColor: "green.500", _dark: { bgColor: "blue.800" } }}
            >
              Execute Sync
            </Button>
          </Stack>
        </Flex>
      }
      bottomRightContent={
        <Flex direction="column" h="full">
          <SectionHeading title={texts["diff.target.title"]} description={texts["diff.target.description"]} />

          <Box flex={1} position="relative">
            <Box position="absolute" inset={0} overflow="auto">
              <OutputBox output={targetString} isLoading={syncExecuted} />
            </Box>
          </Box>
        </Flex>
      }
    />
  );
}
