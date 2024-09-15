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

export type GraphNode = {
  id: string;
  label: string;
  path?: string;
  type: NodeType;
};

export type GraphNodeLink = {
  source: string;
  target: string;
};

export type GraphInfo = {
  links: GraphNodeLink[];
  nodes: GraphNode[];
};

export type AdjcacencyMap = {
  [key: string]: Set<string>;
};
