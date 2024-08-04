import { findAndReplace } from "mdast-util-find-and-replace";
import CUSTOM_REPLACERS from "./replacers/custom";
import OBSIDIAN_REPLACERS from "./replacers/obsidian";

export default function convertToDocusaurusMdx() {
  return async (tree) => {
    findAndReplace(tree, [...CUSTOM_REPLACERS, ...OBSIDIAN_REPLACERS]);
  };
}
