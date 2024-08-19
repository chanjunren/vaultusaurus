import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { map } from "unist-util-map";
import admonitionMapper from "./mappers/admonition";
import imageReplacer from "./replacers/img";
import noteLinkReplacer from "./replacers/noteLink";
import tagReplacer from "./replacers/tag";
import { PluginOptions } from "./types";

export default function convertToDocusaurusMdx({
  customReplacers = [],
}: PluginOptions) {
  return async (ast: Nodes, fileLocation) => {
    const mappedTree = map(ast, admonitionMapper);

    findAndReplace(mappedTree, [
      ...customReplacers,
      imageReplacer,
      tagReplacer,
      noteLinkReplacer,
    ]);

    return mappedTree;
  };
}
