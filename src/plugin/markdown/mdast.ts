import { Text } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import {
  OBSIDIAN_INTERNAL_LINK_REGEX,
  OBSIDIAN_TAG_REGEX,
} from "../../common/constants";
import { ObsidianTagsInfo, ObsidianVaultInfo } from "../../common/types";

export function processFile(
  input: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  fileName: string,
  fileContent: string
) {
  visit(fromMarkdown(fileContent), "text", function (node) {
    processTags(input, tags, node, fileName);
    processInternalLinks(input, node, fileName);
  });
}

function processTags(
  metadata: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  node: Text,
  fileName: string
) {
  const matches = node.value.matchAll(OBSIDIAN_TAG_REGEX);
  for (const match of matches) {
    const tag = match[0].slice(1, match[0].length);
    if (!tags[tag]) {
      tags[tag] = {
        linkedDocuments: [],
      };
    }

    tags[tag].linkedDocuments = [...tags[tag].linkedDocuments, fileName];

    metadata.documents[fileName].tags = [
      ...metadata.documents[fileName].tags,
      tag,
    ];
  }
}

function processInternalLinks(
  metadata: ObsidianVaultInfo,
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
