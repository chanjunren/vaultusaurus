import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { GraphNode } from "../../../docusaurus-obsidian-bridge-common/src/types";

export type ObsidianNoteNode = SimulationNodeDatum & GraphNode;
export type ObsidianNoteLink = SimulationLinkDatum<ObsidianNoteNode>;
export type GraphContextType = {
  hoveredNode?: ObsidianNoteNode;
  setHoveredNode: (node: ObsidianNoteNode) => void;
};
