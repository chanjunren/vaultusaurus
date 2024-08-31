import { fromMarkdown } from "mdast-util-from-markdown";
import { Text } from "mdast-util-from-markdown/lib";
import { visit } from "unist-util-visit";
import {
  OBSIDIAN_INTERNAL_LINK_REGEX,
  OBSIDIAN_TAG_REGEX,
} from "../../docusaurus-obsidian-bridge-common/src/constants";
import {
  RemarkObsidianBridgeInput,
  TagMap,
} from "../../docusaurus-obsidian-bridge-common/src/types";

export function processFile(
  input: RemarkObsidianBridgeInput,
  tags: TagMap,
  fileName: string,
  fileContent: string
) {
  visit(fromMarkdown(fileContent), "text", function (node) {
    processTags(tags, node, fileName);
    processInternalLinks(input, node, fileName);
  });
}

function processTags(tags: TagMap, node: Text, fileName: string) {
  const matches = node.value.matchAll(OBSIDIAN_TAG_REGEX);
  for (const match of matches) {
    const tag = match[0].slice(1, match[0].length);
    if (!tags[tag]) {
      tags[tag] = [];
    }
    tags[tag] = [...tags[tag], fileName];
  }
}

function processInternalLinks(
  metadata: RemarkObsidianBridgeInput,
  node: Text,
  fileName: string
) {
  const matches = node.value.matchAll(OBSIDIAN_INTERNAL_LINK_REGEX);
  for (const match of matches) {
    const internalLink = match[0].slice(2, -2);

    metadata.documents[fileName].internalLinks = [
      ...metadata.documents[fileName].internalLinks,
      internalLink,
    ];
  }
}
