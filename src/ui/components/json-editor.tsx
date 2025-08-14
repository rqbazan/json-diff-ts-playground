import { Box, Skeleton } from "@chakra-ui/react";
import { Editor, type EditorProps } from "@monaco-editor/react";
import merge from "lodash.merge";
import { fontMono } from "#/ui/core/system";
import { useColorModeValue } from "./color-mode";

const DEFAULT_OPTIONS = {
  minimap: { enabled: false },
  fontFamily: fontMono,
  fontSize: 14,
};

const LIGHT_THEME = "vs-light";
const DARK_THEME = "vs-dark";

function EditorLoadingState() {
  return (
    <Box h="full">
      <Skeleton h="full" />
    </Box>
  );
}

export function JsonEditor({ options, ...props }: EditorProps) {
  const theme = useColorModeValue(LIGHT_THEME, DARK_THEME);

  const mergedOptions = merge({}, DEFAULT_OPTIONS, options);

  return <Editor defaultLanguage="json" theme={theme} options={mergedOptions} loading={<EditorLoadingState />} {...props} />;
}
