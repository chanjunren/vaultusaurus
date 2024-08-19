import { Find, Replace } from "mdast-util-find-and-replace";

export interface PluginOptions {
  customReplacers?: [Find, Replace?][];
}
