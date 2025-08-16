import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { type NProgress, NProgressBar } from "#/lib/nprogress";
import { CodeBlock } from "#/ui/core/code-block";

export type OutputBoxProps = {
  output: string;
  isLoading: boolean;
};

export function OutputBox({ output, isLoading }: OutputBoxProps) {
  const nProgressRef = useRef<NProgress>(null);

  useEffect(() => {
    if (isLoading) {
      nProgressRef.current?.start();
    } else {
      nProgressRef.current?.done();
    }
  }, [isLoading]);

  return (
    <Box>
      <NProgressBar ref={nProgressRef} />
      <CodeBlock lang="json" code={output} />
    </Box>
  );
}
