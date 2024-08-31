export type ObsidianTagInfo = {
  linkedDocuments: string[];
  linkedDocumentPaths: string[];
};

export type ObsidianTagsInfo = { [tag: string]: ObsidianTagInfo };

export type DocumentInfo = {
  relativeFilePath: string;
  tags: string[];
  internalLinks: string[];
};

// docusaurus-plugin-obsidian-bridge preprocesses all the markdowns and passes this output JSON to remark-docusaurus-obsidian-bridge for processing
// Mainly used for internal links
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

export type AdjcacencyMap = {
  [key: string]: Set<string>;
};
