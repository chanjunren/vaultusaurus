import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import { ObsidianTagsInfo, ObsidianVaultInfo } from "../../common/types";
import { DocumentIndexer, scanTags, scanWikilinks } from "./indexer";

export function processFile(
  vault: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  fileName: string,
  fileContent: string
) {
  const indexer = new DocumentIndexer(vault, tags, fileName);
  visit(fromMarkdown(fileContent), undefined, (node) => {
    if (!("value" in node) || typeof node.value !== "string" || !node.value) {
      return;
    }
    scanTags(node.value, indexer);
    scanWikilinks(node.value, indexer);
  });
}
