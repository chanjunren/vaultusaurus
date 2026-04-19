export type GraphStyle = {
  graphBg?: string;
  defaultColor?: string;
  activeColor?: string;
};

export type VaultusaurusPluginOptions = {
  tagsToIgnore?: Set<string>;
  notesToIgnore?: Set<string>;
  graphStyle: GraphStyle;
  maxDepth?: number;
};
