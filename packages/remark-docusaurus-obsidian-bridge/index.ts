import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { map } from "unist-util-map";
import admonitionMapper from "./features/admonition";
import imageReplacer from "./features/img";
import noteLinkReplacer from "./features/noteLink";
import tagReplacer from "./features/tag";
import { PluginOptions } from "./types";

export default function convertToDocusaurusMdx(options: PluginOptions) {
  return async (ast: Nodes) => {
    const mappedTree = map(ast, admonitionMapper);

    findAndReplace(mappedTree, [
      ...(options?.customReplacers || []),
      imageReplacer,
      tagReplacer,
      noteLinkReplacer,
    ]);

    return mappedTree;
  };
}
