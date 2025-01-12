import { GraphStyle } from "./options";

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

export type GraphInfoMap = { [filePath: string]: GraphInfo };

export type AdjacencyMap = {
  [key: string]: Set<string>;
};

export type VaultusaurusGlobalData = {
  graphInfo: GraphInfoMap;
  graphStyle: GraphStyle;
};
