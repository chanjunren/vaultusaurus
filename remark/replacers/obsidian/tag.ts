import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

const OBSIDIAN_TAG_REGEX = /#\S.*/g;

const tagReplacer: [Find, Replace?] = [
  OBSIDIAN_TAG_REGEX,
  function (input) {
    return u("inlineCode", input);
  },
];

export default tagReplacer;
