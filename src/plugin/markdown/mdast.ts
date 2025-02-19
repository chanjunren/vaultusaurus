import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import {
  OBSIDIAN_INTERNAL_LINK_REGEX,
  OBSIDIAN_TAG_REGEX,
} from "../../common/constants";
import { ObsidianTagsInfo, ObsidianVaultInfo } from "../../common/types";
import { buildBaseMetadata } from "./utils";

export function processFile(
  input: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  fileName: string,
  fileContent: string
) {
  visit(fromMarkdown(fileContent), undefined, function (node) {
    if ("value" in node) {
      processTagsAndInternalLinks(input, tags, fileName, node.value);
    }
  });
}

function processTagsAndInternalLinks(
  input: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  fileName: string,
  text?: string
) {
  if (!text) {
    return;
  }
  processTags(input, tags, text, fileName);
  processInternalLinks(input, text, fileName);
}

function processTags(
  metadata: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  text: string,
  fileName: string
) {
  const matches = text.matchAll(OBSIDIAN_TAG_REGEX);
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
  text: string,
  fileName: string
) {
  const matches = text.matchAll(OBSIDIAN_INTERNAL_LINK_REGEX);

  for (const match of matches) {
    const internalLink = match[0].slice(2, -2);
    initInternalLinkIfNecessary(internalLink, metadata);
    handleLinkedDocument(fileName, internalLink, metadata);
  }
}

function initInternalLinkIfNecessary(
  link: string,
  metadata: ObsidianVaultInfo
) {
  if (!metadata.documents[link]) {
    metadata.documents[link] = buildBaseMetadata();
  }
}

function handleLinkedDocument(
  sourceFile: string,
  targetFile: string,
  metadata: ObsidianVaultInfo
) {
  addLinkedDocumentIfNotPresent(sourceFile, targetFile, metadata);
  addLinkedDocumentIfNotPresent(targetFile, sourceFile, metadata);
}

function addLinkedDocumentIfNotPresent(
  sourceFile: string,
  targetFile: string,
  metadata: ObsidianVaultInfo
) {
  const relatedDocuments = metadata.documents[sourceFile].relatedDocuments;

  if (!relatedDocuments.has(targetFile)) {
    relatedDocuments.add(targetFile);
  }
}
