import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { MutableRefObject } from "react";
export type ObsidianTagInfo = {
  linkedDocuments: string[];
};

export type ObsidianTagsInfo = { [tag: string]: ObsidianTagInfo };

export type DocumentInfo = {
  relativeFilePath: string;
  tags: string[];
  internalLinks: string[];
};

export type ObsidianVaultInfo = {
  documents: {
    [fileName: string]: DocumentInfo;
  };
};

export type NodeType = "DOCUMENT" | "TAG";

export type GraphNodeInfo = {
  id: string;
  label: string;
  path?: string;
  type: NodeType;
};

export type GraphNodeLinkInfo = {
  source: string;
  target: string;
};

export type GraphInfo = {
  links: GraphNodeLinkInfo[];
  nodes: GraphNodeInfo[];
};

export type AdjcacencyMap = {
  [key: string]: Set<string>;
};

export type ObsidianNoteNode = SimulationNodeDatum & GraphNodeInfo;
export type ObsidianNoteLink = SimulationLinkDatum<ObsidianNoteNode>;

export type LocalGraphContext = {
  hoveredNode?: ObsidianNoteNode;
  setHoveredNode: (node: ObsidianNoteNode) => void;
  adjacencyMap: AdjcacencyMap;
  simulation: MutableRefObject<Simulation<ObsidianNoteNode, ObsidianNoteLink>>;
  updateNode: (id: string, changes: Partial<ObsidianNoteNode>) => void;
};
