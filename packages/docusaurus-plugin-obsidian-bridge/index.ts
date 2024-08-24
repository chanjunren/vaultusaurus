import { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import { readFileSync } from "fs";
import { globStreamSync } from "glob";
import { Text } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import path from "path";
import { visit } from "unist-util-visit";
import { OBSIDIAN_TAG_REGEX } from "../docusaurus-obsidian-bridge-common/constants";
import { DocumentTags, FileLocations } from "./types";

export default async function pluginDocusaurusObsidianBridge(
  context: LoadContext,
  opts: PluginOptions
): Promise<Plugin> {
  return {
    name: "docusaurus-obsidian-bridge",

    async contentLoaded({ actions }) {
      const { createData } = actions;
      const docsDir = path.join(context.siteDir, "docs");
      const documentLocations: FileLocations = {};
      const tags: DocumentTags = {};

      try {
        globStreamSync("**/*.{md,mdx}", { cwd: docsDir }).on("data", (p) => {
          const filePath = path.join(docsDir, p);
          const fileContent = readFileSync(filePath, { encoding: "utf-8" });
          documentLocations[p] = filePath;

          visit(fromMarkdown(fileContent), "text", function (node) {
            processTags(tags, node, p);
          });
        });

        await createData(
          "bridgeMetadata.json",
          JSON.stringify({
            documentLocations,
            tags,
          })
        );
      } catch (err) {
        console.error("🐞", err);
      }
    },
  };

  function processTags(tags: DocumentTags, node: Text, p: string) {
    const matches = node.value.matchAll(OBSIDIAN_TAG_REGEX);
    for (const match of matches) {
      const tag = match[0].slice(1, match[0].length);
      if (!tags[tag]) {
        tags[tag] = [];
      }
      tags[tag] = [...tags[tag], p];
    }
  }
}
