import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNProgressBar } from "#/lib/nprogress";
import { CodeBlock } from "#/ui/core/code-block";

export type OutputBoxProps = {
  output: string;
  isLoading: boolean;
};

export function OutputBox({ output, isLoading }: OutputBoxProps) {
  const nProgressBar = useNProgressBar({
    parent: "#nprogress-container",
  });

  useEffect(() => {
    if (isLoading) {
      nProgressBar.start();
    } else {
      nProgressBar.done();
    }
  }, [isLoading, nProgressBar]);

  return (
    <Box>
      <Box id="nprogress-container" h="2px" position="sticky" top={0} w="full" />
      <CodeBlock lang="json" code={output} />
    </Box>
  );
}
