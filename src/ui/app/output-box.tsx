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
    parent: "#diff-output-box",
  });

  useEffect(() => {
    if (isLoading) {
      nProgressBar.start();
    } else {
      nProgressBar.done();
    }
  }, [isLoading, nProgressBar]);

  return (
    <Box id="diff-output-box">
      <CodeBlock lang="json" code={output} />
    </Box>
  );
}
