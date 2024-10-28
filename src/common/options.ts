export type GraphStyle = {
  graphBg?: string;
  defaultColor?: string;
  activeColor?: string;
};

export type VaultusaurusPluginOptions = {
  ignoredGraphTags?: string[];
  graphStyle: GraphStyle;
};
