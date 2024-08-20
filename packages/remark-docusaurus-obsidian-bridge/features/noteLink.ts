import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

export const OBSIDIAN_NOTE_LINK_REGEX = /(?<!!)\[\[.*?\]\]/g;

const noteLinkReplacer: [Find, Replace?] = [
  OBSIDIAN_NOTE_LINK_REGEX,
  function (input) {
    const linkedDocName = input.slice(2, -2);
    return u("link", {
      url: `/docs/zettelkasten/${linkedDocName}`, // TODO: Make this URL configurable
      children: [u("text", linkedDocName)],
    });
  },
];

export default noteLinkReplacer;
