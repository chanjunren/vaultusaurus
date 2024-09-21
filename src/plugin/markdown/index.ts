import { LoadContext, PluginContentLoadedActions } from "@docusaurus/types";
import VaultusaurusPluginOptions from "@vaultusaurus/plugin/options";
import { readFileSync } from "fs";
import { globStreamSync } from "glob";
import path from "path";
import { REMARK_VAULTUSAURUS_INPUT } from "../../common/constants";
import { ObsidianTagsInfo, ObsidianVaultInfo } from "../../common/types";
import { processFile } from "./mdast";
import { postProcess } from "./postprocess";

export default async function outputDataForThemeAndRemarkPlugin(
  context: LoadContext,
  actions: PluginContentLoadedActions,
  options: VaultusaurusPluginOptions
) {
  const { createData } = actions;
  const docsDirectory = path.join(context.siteDir, "docs");
  const remarkPluginInput: ObsidianVaultInfo = {
    documents: {},
  };

  const tagsInfo: ObsidianTagsInfo = {};

  try {
    globStreamSync("**/*.{md,mdx}", { cwd: docsDirectory }).on(
      "data",
      (relativePath) => {
        const fullPath = path.join(docsDirectory, relativePath);
        const fileContent = readFileSync(fullPath, { encoding: "utf-8" });
        const fileName = getFileName(relativePath);

        initDocument(remarkPluginInput, fileName, relativePath);
        processFile(remarkPluginInput, tagsInfo, fileName, fileContent);
      }
    );

    // Can only be done after all markdown files have been pre-processed
    postProcess(tagsInfo, remarkPluginInput, actions, options);

    await createData(
      REMARK_VAULTUSAURUS_INPUT,
      JSON.stringify(remarkPluginInput)
    );
  } catch (err) {
    console.error("🐞", err);
  }
}

function initDocument(
  metadata: ObsidianVaultInfo,
  fileName: string,
  p: string
) {
  metadata.documents[fileName] = {
    relativeFilePath: path.join("/docs", p.slice(0, -3)),
    tags: [],
    internalLinks: [],
  };
}

function getFileName(path: string): string {
  const arr = path.split("/");
  return arr[arr.length - 1].split(".md")[0];
}
