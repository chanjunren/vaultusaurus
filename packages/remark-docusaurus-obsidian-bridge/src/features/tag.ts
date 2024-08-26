import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";
import { OBSIDIAN_TAG_REGEX } from "../../../docusaurus-obsidian-bridge-common/src/constants";

// TODO: Figure out how to fix typescript error
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
