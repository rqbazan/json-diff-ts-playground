import { Box, Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useJsonEditorState } from "#/hooks/use-json-editor-state";
import type { DiffOptions } from "#/lib/json-diff";
import { createRHFPersist } from "#/lib/rhf-persist";
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
  convertToDiffOptions,
  convertToOptionsFormInputs,
  type DiffOrSyncInput,
  getDefaultOptionsFormInputs,
  getDiffString,
} from "#/utils/diff-sync";

const { useRHFRestore, RHFPersist } = createRHFPersist<OptionsFormInputs>({ persistKey: "diff_form_options" });

function hasRestoredValues(values: Record<string, unknown>): boolean {
  const keysToSkip = values.keysToSkip as string[] | undefined;
  const embeddedObjKeys = values.embeddedObjKeys as Record<string, string> | undefined;
  const treatTypeChangeAsReplace = values.treatTypeChangeAsReplace as boolean | undefined;

  return treatTypeChangeAsReplace !== undefined || (keysToSkip?.length ?? 0) > 0 || Object.keys(embeddedObjKeys ?? {}).length > 0;
}

export function DiffPage() {
  const [diffExecuted, setDiffExecuted] = useState(false);

  const [selectedSamplesId, setSelectedSamplesId] = useLocalStorage<string[]>("diff_selected_samples", [SAMPLE_ID.SIMPLE]);

  const [selectedSampleId] = selectedSamplesId;

  const initialSample = useMemo(() => {
    return selectedSampleId ? samples[selectedSampleId as SampleId] : undefined;
  }, [selectedSampleId]);

  const sourceEditorState = useJsonEditorState("diff_source_editor", initialSample?.sourceString);
  const targetEditorState = useJsonEditorState("diff_target_editor", initialSample?.targetString);

  const restoredValues = useRHFRestore();

  const [enabledDiffOptions, setEnableDiffOptions] = useLocalStorage<boolean>(
    "diff_enabled_options",
    initialSample?.diffOptions !== undefined || hasRestoredValues(restoredValues),
  );

  const defaultValues = initialSample?.diffOptions
    ? convertToOptionsFormInputs(initialSample.diffOptions)
    : restoredValues
      ? restoredValues
      : getDefaultOptionsFormInputs();

  const form = useForm<OptionsFormInputs>({
    disabled: !enabledDiffOptions,
    defaultValues,
  });

  const [changesString, setChangesString] = useState(() => {
    return getDiffString(
      sourceEditorState.value,
      targetEditorState.value,
      enabledDiffOptions ? convertToDiffOptions(defaultValues) : undefined,
    );
  });

  function executeDiff(source: DiffOrSyncInput, target: DiffOrSyncInput, options: DiffOptions | undefined) {
    try {
      setChangesString(getDiffString(source, target, options));
    } catch (error) {
      console.error("Error executing diff:", error);

      toaster.create({
        title: "Diff Error",
        type: "error",
        description: "An error occurred while executing the diff.",
      });
    }
  }

  async function executeDiffAsync(source: DiffOrSyncInput, target: DiffOrSyncInput, options: DiffOptions | undefined) {
    try {
      setDiffExecuted(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // simulate async operation
      executeDiff(source, target, options);
    } catch (error) {
      console.error("Can't execute diff successfully", error);
    } finally {
      setDiffExecuted(false);
    }
  }

  function onEditorChange(editorState: ReturnType<typeof useJsonEditorState>, value: string | undefined) {
    editorState.setValue(value ?? "");
    setSelectedSamplesId([]);
  }

  async function onSampleSelectionChange(selection: string[]) {
    setSelectedSamplesId(selection);

    const selectedSample = samples[selection[0] as SampleId];
    const { source, target, sourceString, targetString, diffOptions } = selectedSample;

    sourceEditorState.setValue(sourceString);
    targetEditorState.setValue(targetString);

    if (diffOptions) {
      form.reset(convertToOptionsFormInputs(diffOptions));
      setEnableDiffOptions(true);
    } else {
      form.reset(getDefaultOptionsFormInputs());
      setEnableDiffOptions(false);
    }

    await executeDiffAsync(source, target, diffOptions);
  }

  const onExecuteIntent: SubmitHandler<OptionsFormInputs> = async (formInputs) => {
    const diffOptions = convertToDiffOptions(formInputs);

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

    await executeDiffAsync(sourceEditorState.value, targetEditorState.value, diffOptions);
  };

  return (
    <PanelsLayout
      autoSavePreffixId="diff-page"
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
          <SectionHeading title={texts["diff.target.title"]} description={texts["diff.target.description"]} />
          <JsonEditor
            value={targetEditorState.value}
            onChange={(value) => onEditorChange(targetEditorState, value)}
            onValidate={(markers) => sourceEditorState.setIsValid(markers.length === 0)}
          />
        </Flex>
      }
      bottomLeftContent={
        <Flex direction="column" h="full" borderRight="2px" borderColor="gray.800">
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

              <FormProvider {...form}>
                <form id="diff-options-form" onSubmit={form.handleSubmit(onExecuteIntent)}>
                  <OptionsFieldset enabled={enabledDiffOptions} onEnabledChange={setEnableDiffOptions} />
                  <RHFPersist />
                </form>
              </FormProvider>
            </Box>
          </Box>

          <Separator />

          <Stack mt="auto" p={3}>
            <Button
              size="sm"
              form="diff-options-form"
              type="submit"
              bgColor="green.400"
              color="black"
              _dark={{ bgColor: "blue.700", color: "white" }}
              _hover={{ bgColor: "green.500", _dark: { bgColor: "blue.800" } }}
            >
              Execute Diff
            </Button>
          </Stack>
        </Flex>
      }
      bottomRightContent={
        <Flex direction="column" h="full">
          <SectionHeading title={texts["diff.output.title"]} description={texts["diff.output.description"]} />

          <Box flex={1} position="relative">
            <Box position="absolute" inset={0} overflow="auto">
              <OutputBox output={changesString} isLoading={diffExecuted} />
            </Box>
          </Box>
        </Flex>
      }
    />
  );
}
