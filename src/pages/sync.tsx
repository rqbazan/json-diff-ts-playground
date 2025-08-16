import { Box, Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { HiCheck } from "react-icons/hi2";
import { useJsonEditorState } from "#/hooks/use-json-editor-state";
import { jsonDiff, jsonSync } from "#/lib/json-diff";
import { SAMPLE_ID, type SampleId, sampleCollection, samples } from "#/samples";
import { JsonEditor } from "#/ui/app/json-editor";
import { OutputBox } from "#/ui/app/output-box";
import { SectionHeading } from "#/ui/app/section-heading";
import * as Select from "#/ui/core/select";
import { toaster } from "#/ui/toaster";
import { texts } from "#/ui/wording";
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
      const changes = jsonDiff(initialSample.source, initialSample.target);

      return toJSON(changes);
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

  function executeSync(sourceString: string, changes: string) {
    try {
      const target = jsonSync(fromJSON(sourceString), fromJSON(changes));

      setTargetString(toJSON(target));
    } catch (error) {
      console.error("Error executing sync:", error);

      toaster.create({
        title: "Sync Error",
        type: "error",
        description: "An error occurred while executing the sync.",
      });
    }
  }

  async function executeSyncAsync(sourceString: string, changes: string) {
    try {
      setSyncExecuted(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // simulate async operation
      executeSync(sourceString, changes);
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

    sourceEditorState.setValue(selectedSample.sourceString);

    const changes = jsonDiff(selectedSample.source, selectedSample.target);

    const changesString = toJSON(changes);

    changesEditorState.setValue(changesString);

    await executeSyncAsync(selectedSample.sourceString, changesString);
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
          <SectionHeading title={texts["sync.changes.title"]} description={texts["sync.changes.description"]} />
          <JsonEditor
            value={changesEditorState.value}
            onChange={(value) => onEditorChange(changesEditorState, value)}
            onValidate={(markers) => sourceEditorState.setIsValid(markers.length === 0)}
          />
        </Flex>
      </Flex>

      <Separator size="md" />

      <Flex flex={1}>
        <Flex direction="column" h="full" w="30%" borderRight="2px" borderColor="gray.800">
          <SectionHeading title={texts["sync.config.title"]} description={texts["sync.config.description"]} />
          <Stack flex={1}>
            <Stack p={3} flex={1}>
              <Select.SelectRoot
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
            </Stack>

            <Separator />

            <Stack mt="auto" px={3} py={2}>
              <Button
                size="sm"
                onClick={onExecuteSyncClick}
                bgColor="green.400"
                color="black"
                _dark={{ bgColor: "blue.700", color: "white" }}
              >
                {syncExecuted && <HiCheck />} Execute Sync
              </Button>
            </Stack>
          </Stack>
        </Flex>

        <Separator orientation="vertical" size="md" />

        <Flex direction="column" h="full" w="70%">
          <SectionHeading title={texts["diff.target.title"]} description={texts["diff.target.description"]} />

          <Box flex={1} position="relative">
            <Box position="absolute" inset={0} overflow="auto" id="sync-output-box">
              <OutputBox output={targetString} isLoading={syncExecuted} />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
