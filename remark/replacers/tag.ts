import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

const OBSIDIAN_TAG_REGEX = /#\S+/g;

// TODO: Figure out how to fix typescript error
// TODO: Integrate with linked nodes
const tagReplacer: [Find, Replace?] = [
  OBSIDIAN_TAG_REGEX,
  function (input) {
    return u("mdxJsxFlowElement", {
      name: "span",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "class",
          value: "theme-doc-version-badge badge badge--secondary",
        },
      ],
      children: [
        u("text", {
          value: input,
        }),
      ],
    });
  },
];

export default tagReplacer;
