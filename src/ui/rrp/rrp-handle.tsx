import { Separator, type SeparatorProps } from "@chakra-ui/react";
import { PanelResizeHandle } from "react-resizable-panels";

export function RRPHandle(props: SeparatorProps) {
  return (
    <Separator size="md" {...props} asChild>
      <PanelResizeHandle />
    </Separator>
  );
}
