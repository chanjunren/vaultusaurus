import { AdjcacencyMap, GraphNodeInfo } from "@vaultusaurus/common/types";
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { MutableRefObject } from "react";

export type ObsidianNoteNode = SimulationNodeDatum & GraphNodeInfo;
export type ObsidianNoteLink = SimulationLinkDatum<ObsidianNoteNode>;

export type LocalGraphContext = {
  hoveredNode?: ObsidianNoteNode;
  setHoveredNode: (node: ObsidianNoteNode) => void;
  adjacencyMap: AdjcacencyMap;
  simulation: MutableRefObject<Simulation<ObsidianNoteNode, ObsidianNoteLink>>;
  updateNode: (id: string, changes: Partial<ObsidianNoteNode>) => void;
};
