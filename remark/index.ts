import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { map } from "unist-util-map";
import admonitionMapper from "./mappers/admonition";
import CUSTOM_REPLACERS from "./replacers/custom";
import OBSIDIAN_REPLACERS from "./replacers/obsidian";

export default function convertToDocusaurusMdx() {
  return async (tree: Nodes) => {
    findAndReplace(tree, [...CUSTOM_REPLACERS, ...OBSIDIAN_REPLACERS]);

    return map(tree, admonitionMapper);
  };
}
