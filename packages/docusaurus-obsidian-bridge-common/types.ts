export type TagMap = { [tag: string]: string[] };

export type DocumentMetadata = {
  relativeFilePath: string;
  tags: string[];
  internalLinks: string[];
};

export type Output = {
  documents: {
    [fileName: string]: DocumentMetadata;
  };
  tags: TagMap;
};
