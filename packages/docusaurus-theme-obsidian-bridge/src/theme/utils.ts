import { ObsidianNoteNode } from "./types";

export function isNode(
  node: string | number | ObsidianNoteNode
): node is ObsidianNoteNode {
  return typeof node === "object" && !!node["x"] && !!node["y"];
}

export const DEFAULT_SECONDARY_COLOR = "#fff";
export const DEFAULT_PRIMARY_COLOR = "var(--ifm-color-primary)";
