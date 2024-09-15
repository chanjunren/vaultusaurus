import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { MutableRefObject } from "react";
import { GraphNode } from "../../../docusaurus-obsidian-bridge-common/src/types";

export type ObsidianNoteNode = SimulationNodeDatum & GraphNode;
export type ObsidianNoteLink = SimulationLinkDatum<ObsidianNoteNode>;

export type LocalGraphContext = {
  hoveredNode?: ObsidianNoteNode;
  setHoveredNode: (node: ObsidianNoteNode) => void;
  adjacencyMap: AdjcacencyMap;
  simulation: MutableRefObject<Simulation<ObsidianNoteNode, ObsidianNoteLink>>;
};

export type AdjcacencyMap = { [key: string]: Set<string> };
