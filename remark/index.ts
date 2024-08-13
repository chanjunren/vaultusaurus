import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { map } from "unist-util-map";
import admonitionMapper from "./mappers/admonition.js";
import CUSTOM_REPLACERS from "./replacers/custom/index.js";
import OBSIDIAN_REPLACERS from "./replacers/obsidian/index.js";

export default function convertToDocusaurusMdx() {
  return async (tree: Nodes) => {
    console.log("DOCCIE");
    console.log(JSON.stringify(tree));
    findAndReplace(tree, [...CUSTOM_REPLACERS, ...OBSIDIAN_REPLACERS]);

    return map(tree, admonitionMapper);
  };
}
