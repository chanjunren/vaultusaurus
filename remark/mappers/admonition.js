import { u } from "unist-builder";
import { fromMarkdown } from "mdast-util-from-markdown";

const ADMONITION_OPTIONS = [
  "note",
  "seealso",
  "abstract",
  "summary",
  "tldr",
  "info",
  "todo",
  "tip",
  "hint",
  "important",
  "success",
  "check",
  "done",
  "question",
  "help",
  "faq",
  "warning",
  "caution",
  "attention",
  "failure",
  "fail",
  "missing",
  "danger",
  "error",
  "bug",
  "example",
  "quote",
  "cite",
];

const OBSIDIAN_ADMONITIONS = new Set(
  ADMONITION_OPTIONS.map((option) => `ad-${option}`)
);

function isObsidianAdmonition(node) {
  return node.type === "code" && OBSIDIAN_ADMONITIONS.has(node.lang);
}

const admonitionMapper = function (node) {
  return isObsidianAdmonition(node)
    ? Object.assign(
        {},
        node,
        u("containerDirective", {
          name: "note", // TODO: Enhance this
          children: fromMarkdown(node.value).children,
        })
      )
    : node;
};

export default admonitionMapper;
