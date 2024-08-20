import { LoadContext, PluginOptions } from "@docusaurus/types";
import { readFileSync } from "fs";
import { globStreamSync } from "glob";
import { fromMarkdown } from "mdast-util-from-markdown";
import path from "path";
import { visit } from "unist-util-visit";
import { OBSIDIAN_TAG_REGEX } from "../docusaurus-obsidian-bridge-common/constants";
import { MarkdownFileMap } from "./types";

export default async function pluginDocusaurusObsidianBridge(
  context: LoadContext,
  opts: PluginOptions
) {
  return {
    name: "docusaurus-obsidian-bridge",

    async contentLoaded({ actions }) {
      const { createData } = actions;
      const docsDir = path.join(context.siteDir, "docs");
      const documentLocations: MarkdownFileMap = {};
      const tags: { [key: string]: Set<string> } = {};

      try {
        globStreamSync("**/*.{md,mdx}", { cwd: docsDir }).on("data", (p) => {
          const filePath = path.join(docsDir, p);
          const fileContent = readFileSync(filePath, { encoding: "utf-8" });

          visit(fromMarkdown(fileContent), "text", function (node) {
            // Handle tags
            if (node.value.match(OBSIDIAN_TAG_REGEX)) {
            }
          });

          documentLocations[p] = filePath;
        });

        await createData(
          "bridgeMetadata.json",
          JSON.stringify(documentLocations)
        );
      } catch (err) {
        console.error("🐞", err);
      }
    },
  };
}
