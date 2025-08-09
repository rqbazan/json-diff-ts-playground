import { createShikiAdapter, Float, CodeBlock as HeadlessCodeBlock, IconButton } from "@chakra-ui/react";
import { useMemo } from "react";
import { DARK_THEME, LIGHT_THEME, loadShikiHighlighter, type SupportedLanguage } from "../../lib/shiki";
import { useColorMode } from "./color-mode";

type CodeBlockProps = {
  code: string;
  lang: SupportedLanguage;
};

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const { colorMode } = useColorMode();

  const shikiAdapter = useMemo(() => {
    return createShikiAdapter({
      load: loadShikiHighlighter,
      highlightOptions: {
        lang,
        theme: colorMode === "dark" ? DARK_THEME : LIGHT_THEME,
      },
    });
  }, [colorMode, lang]);

  return (
    <HeadlessCodeBlock.AdapterProvider value={shikiAdapter}>
      <HeadlessCodeBlock.Root
        code={code}
        language={lang}
        meta={{ showLineNumbers: true, colorScheme: colorMode }}
        borderRadius={0}
        minH="full"
      >
        <HeadlessCodeBlock.Content>
          <Float placement="top-end" offset="5" zIndex="1">
            <HeadlessCodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="sm">
                <HeadlessCodeBlock.CopyIndicator />
              </IconButton>
            </HeadlessCodeBlock.CopyTrigger>
          </Float>
          <HeadlessCodeBlock.Code>
            <HeadlessCodeBlock.CodeText />
          </HeadlessCodeBlock.Code>
        </HeadlessCodeBlock.Content>
      </HeadlessCodeBlock.Root>
    </HeadlessCodeBlock.AdapterProvider>
  );
}
