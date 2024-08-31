import { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import { readFileSync } from "fs";
import { globStreamSync } from "glob";
import path from "path";
import { REMARK_OBSIDIAN_BRIDGE_INPUT } from "../../docusaurus-obsidian-bridge-common/src/constants";
import {
  RemarkObsidianBridgeInput,
  TagMap,
} from "../../docusaurus-obsidian-bridge-common/src/types";
import { processFile } from "./mdast";

export default async function docusaurusPluginObsidianBridge(
  context: LoadContext,
  opts: PluginOptions
): Promise<Plugin> {
  return {
    name: "docusaurus-plugin-obsidian-bridge",

    async contentLoaded({ actions }) {
      const { createData, setGlobalData } = actions;
      const docsDirectory = path.join(context.siteDir, "docs");
      const remarkPluginInput: RemarkObsidianBridgeInput = {
        documents: {},
      };

      const tagsInfo: TagMap = {};

      try {
        globStreamSync("**/*.{md,mdx}", { cwd: docsDirectory }).on(
          "data",
          (p) => {
            const filePath = path.join(docsDirectory, p);
            const fileContent = readFileSync(filePath, { encoding: "utf-8" });
            const fileName = getFileName(p);

            initDocument(remarkPluginInput, fileName, p);
            processFile(remarkPluginInput, tagsInfo, fileName, fileContent);
          }
        );

        await createData(
          REMARK_OBSIDIAN_BRIDGE_INPUT,
          JSON.stringify(remarkPluginInput)
        );
      } catch (err) {
        console.error("🐞", err);
      }
    },
  };

  function initDocument(
    metadata: RemarkObsidianBridgeInput,
    fileName: string,
    p: string
  ) {
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
}
