import { Find, Replace } from "mdast-util-find-and-replace";

export interface RemarkDocusaurusObsidianBridgeOptions {
  customReplacers?: [Find, Replace?][];
}
