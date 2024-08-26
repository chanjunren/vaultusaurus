import { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import { readFileSync } from "fs";
import { globStreamSync } from "glob";
import { Text } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import path from "path";
import { visit } from "unist-util-visit";
import {
  OBSIDIAN_INTERNAL_LINK_REGEX,
  OBSIDIAN_TAG_REGEX,
  VAULT_METADATA,
} from "../../docusaurus-obsidian-bridge-common/src/constants";
import { Output } from "../../docusaurus-obsidian-bridge-common/src/types";

export default async function docusaurusPluginObsidianBridge(
  context: LoadContext,
  opts: PluginOptions
): Promise<Plugin> {
  return {
    name: "docusaurus-plugin-obsidian-bridge",

    async contentLoaded({ actions }) {
      const { createData, setGlobalData } = actions;
      const docsDirectory = path.join(context.siteDir, "docs");
      const metadata: Output = {
        documents: {},
        tags: {},
      };

      try {
        globStreamSync("**/*.{md,mdx}", { cwd: docsDirectory }).on(
          "data",
          (p) => {
            const filePath = path.join(docsDirectory, p);
            const fileContent = readFileSync(filePath, { encoding: "utf-8" });
            const fileName = getFileName(p);

            initDocument(metadata, fileName, p);

            visit(fromMarkdown(fileContent), "text", function (node) {
              processTags(metadata, node, fileName);
              processInternalLinks(metadata, node, fileName);
            });
          }
        );

        await createData(VAULT_METADATA, JSON.stringify(metadata));
        await setGlobalData(metadata);
      } catch (err) {
        console.error("🐞", err);
      }
    },
  };

  function initDocument(metadata: Output, fileName: string, p: string) {
    metadata.documents[fileName] = {
      relativeFilePath: path.join("/docs", p),
      tags: [],
      internalLinks: [],
    };
  }

  function getFileName(path: string): string {
    const arr = path.split("/");
    return arr[arr.length - 1].split(".md")[0];
  }

  function processTags(metadata: Output, node: Text, fileName: string) {
    const matches = node.value.matchAll(OBSIDIAN_TAG_REGEX);
    for (const match of matches) {
      const tag = match[0].slice(1, match[0].length);
      if (!metadata.tags[tag]) {
        metadata.tags[tag] = [];
      }
      metadata.tags[tag] = [...metadata.tags[tag], fileName];

      metadata.documents[fileName].tags = [
        ...metadata.documents[fileName].tags,
        tag,
      ];
    }
  }

  function processInternalLinks(
    metadata: Output,
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
}
