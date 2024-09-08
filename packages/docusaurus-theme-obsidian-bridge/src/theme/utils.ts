import { ObsidianNoteNode } from "./types";

export function isNode(
  node: string | number | ObsidianNoteNode
): node is ObsidianNoteNode {
  return typeof node === "object" && !!node["x"] && !!node["y"];
}
