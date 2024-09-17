import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";
import { OBSIDIAN_TAG_REGEX } from "../../common/constants";

const tagReplacer: [Find, Replace?] = [
  OBSIDIAN_TAG_REGEX,
  // @ts-ignore
  function (input) {
    return u("mdxJsxFlowElement", {
      name: "span",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "className",
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
