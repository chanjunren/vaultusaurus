import { fromMarkdown } from "mdast-util-from-markdown";
import { Node } from "unist";
import { u } from "unist-builder";
import { docusaurusAdmonition, OBSIDIAN_ADMONITIONS } from "../constants";

function isObsidianAdmonition(node) {
  return node.type === "code" && OBSIDIAN_ADMONITIONS.has(node.lang);
}

function admonitionTitle(type: string): Node {
  return u("paragraph", {
    data: {
      directiveLabel: true,
    },
    children: [u("text", type.toUpperCase())],
  });
}

function admonitionType(node) {
  try {
    return node.lang.split("-")[1];
  } catch (e) {
    console.error("Error trying to get admonitionType for node: ", node, e);
    return "info";
  }
}

const admonitionMapper = function (node) {
  if (!isObsidianAdmonition(node)) {
    return node;
  }

  const type: string = admonitionType(node);
  return Object.assign(
    {},
    node,
    u("containerDirective", {
      name: docusaurusAdmonition(type),
      children: [admonitionTitle(type), ...fromMarkdown(node.value).children],
    })
  );
};

export default admonitionMapper;
