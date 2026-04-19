import type { GraphStyle } from "@vaultusaurus/common/options";
import type { GraphNodeInfo } from "@vaultusaurus/common/types";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { useGraphManager, useHoverManager } from "./hooks";

export type ObsidianNoteNode = SimulationNodeDatum & GraphNodeInfo;
export type ObsidianNoteLink = SimulationLinkDatum<ObsidianNoteNode>;

export type IGraphContext = {
  graphManager: ReturnType<typeof useGraphManager>;
  hoverManager: ReturnType<typeof useHoverManager>;
  graphStyle: GraphStyle;
};
