import { Box, Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { HiCheck } from "react-icons/hi2";
import { useJsonEditorState } from "#/hooks/use-json-editor-state";
import { type DiffOptions, jsonDiff } from "#/lib/json-diff";
import { createRHFPersist } from "#/lib/rhf-persist";
import { SAMPLE_ID, type SampleId, sampleCollection, samples } from "#/samples";
import { JsonEditor } from "#/ui/app/json-editor";
import { OptionsFieldset, type OptionsFormInputs } from "#/ui/app/options-fieldset";
import { OutputBox } from "#/ui/app/output-box";
import { SectionHeading } from "#/ui/app/section-heading";
import * as Select from "#/ui/core/select";
import { toaster } from "#/ui/toaster";
import { texts } from "#/ui/wording";
import { fromJSON, toJSON } from "#/utils/json-functions";

const { useRHFRestore, RHFPersist } = createRHFPersist<OptionsFormInputs>({ persistKey: "diff_form_options" });

function convertToDiffOptions(formInputs: OptionsFormInputs): DiffOptions {
  return {
    keysToSkip: formInputs.keysToSkip?.map((item) => item.value) ?? [],
    embeddedObjKeys: Object.fromEntries(formInputs.embeddedObjKeys?.map((item) => [item.key, item.id]) ?? []),
    treatTypeChangeAsReplace: formInputs.treatTypeChangeAsReplace ?? false,
  };
}

function convertToOptionsFormInputs(options: DiffOptions): OptionsFormInputs {
  return {
    keysToSkip: options.keysToSkip?.map((item) => ({ value: item })) ?? [],
    embeddedObjKeys: Object.entries(options.embeddedObjKeys ?? []).map(([key, id]) => ({ key, id })),
    treatTypeChangeAsReplace: options.treatTypeChangeAsReplace ?? false,
  };
}

function getDefaultOptionsFormInputs(): OptionsFormInputs {
  return {
    keysToSkip: [],
    embeddedObjKeys: [],
    treatTypeChangeAsReplace: false,
  };
}

function hasRestoredValues(values: Record<string, unknown>): boolean {
  const keysToSkip = values.keysToSkip as string[] | undefined;
  const embeddedObjKeys = values.embeddedObjKeys as Record<string, string> | undefined;
  const treatTypeChangeAsReplace = values.treatTypeChangeAsReplace as boolean | undefined;

  return treatTypeChangeAsReplace !== undefined || (keysToSkip?.length ?? 0) > 0 || Object.keys(embeddedObjKeys ?? {}).length > 0;
}

function getDiffString(sourceString: string, targetString: string, options: DiffOptions | undefined) {
  const diff = jsonDiff(fromJSON(sourceString), fromJSON(targetString), options);
  return toJSON(diff);
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

  const optionsForm = useForm<OptionsFormInputs>({
    disabled: !enabledDiffOptions,
    defaultValues: defaultValues,
  });

  const [changesString, setChangesString] = useState(() => {
    return getDiffString(
      sourceEditorState.value,
      targetEditorState.value,
      enabledDiffOptions ? convertToDiffOptions(defaultValues) : undefined,
    );
  });

  function executeDiff(sourceString: string, targetString: string, options: DiffOptions | undefined) {
    setChangesString(getDiffString(sourceString, targetString, options));
  }

  async function executeDiffAsync(sourceString: string, targetString: string, options: DiffOptions | undefined) {
    try {
      setDiffExecuted(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // simulate async operation
      executeDiff(sourceString, targetString, options);
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
    const { sourceString, targetString, diffOptions } = selectedSample;

    sourceEditorState.setValue(sourceString);
    targetEditorState.setValue(targetString);

    if (diffOptions) {
      optionsForm.reset(convertToOptionsFormInputs(diffOptions));
      setEnableDiffOptions(true);
    } else {
      optionsForm.reset(getDefaultOptionsFormInputs());
      setEnableDiffOptions(false);
    }

    await executeDiffAsync(sourceString, targetString, diffOptions);
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

              <FormProvider {...optionsForm}>
                <form id="diff-options-form" onSubmit={optionsForm.handleSubmit(onExecuteIntent)}>
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
            >
              {diffExecuted && <HiCheck />} Execute Diff
            </Button>
          </Stack>
        </Flex>

        <Separator orientation="vertical" size="md" />

        <Flex direction="column" h="full" w="70%">
          <SectionHeading title={texts["diff.output.title"]} description={texts["diff.output.description"]} />

          <Box flex={1} position="relative">
            <Box position="absolute" inset={0} overflow="auto">
              <OutputBox output={changesString} isLoading={diffExecuted} />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
