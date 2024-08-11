import { findAndReplace } from "mdast-util-find-and-replace";
import CUSTOM_REPLACERS from "./replacers/custom/index.js";
import OBSIDIAN_REPLACERS from "./replacers/obsidian/index.js";

export default function convertToDocusaurusMdx() {
  return async (tree) => {
    console.log("DOCCIE");
    console.log(JSON.stringify(tree));
    findAndReplace(tree, [...CUSTOM_REPLACERS, ...OBSIDIAN_REPLACERS]);
  };
}
