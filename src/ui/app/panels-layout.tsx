import { Panel, PanelGroup } from "react-resizable-panels";
import { RRPHandle } from "../rrp/rrp-handle";

export type PanelsLayoutProps = {
  autoSavePreffixId: string;
  topLeftContent: React.ReactNode;
  topRightContent: React.ReactNode;
  bottomLeftContent: React.ReactNode;
  bottomRightContent: React.ReactNode;
};

export function PanelsLayout({
  autoSavePreffixId,
  topLeftContent,
  topRightContent,
  bottomLeftContent,
  bottomRightContent,
}: PanelsLayoutProps) {
  return (
    <PanelGroup direction="vertical" autoSaveId={`${autoSavePreffixId}-root-panel-group`}>
      <Panel>
        <PanelGroup direction="horizontal" autoSaveId={`${autoSavePreffixId}-top-panel-group`}>
          <Panel>{topLeftContent}</Panel>
          <RRPHandle orientation="vertical" />
          <Panel>{topRightContent}</Panel>
        </PanelGroup>
      </Panel>
      <RRPHandle />
      <Panel>
        <PanelGroup direction="horizontal" autoSaveId={`${autoSavePreffixId}-bottom-panel-group`}>
          <Panel defaultSize={30}>{bottomLeftContent}</Panel>
          <RRPHandle orientation="vertical" />
          <Panel>{bottomRightContent}</Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
