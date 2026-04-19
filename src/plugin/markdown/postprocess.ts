import type { PluginContentLoadedActions } from "@docusaurus/types";
import type { VaultusaurusPluginOptions } from "../../common/options";
import type {
  GraphInfo,
  ObsidianTagsInfo,
  ObsidianVaultInfo,
  VaultusaurusGlobalData,
} from "../../common/types";
import { buildGlobalGraph, buildGraphInfo } from "./graph";

export function buildAndSetGlobalData(
  tags: ObsidianTagsInfo,
  vault: ObsidianVaultInfo,
  { setGlobalData }: PluginContentLoadedActions,
  options: VaultusaurusPluginOptions
) {
  const graphInfoMap: { [filePath: string]: GraphInfo } = {};
  Object.keys(vault.documents).forEach((fileName) => {
    if (options.notesToIgnore?.has(fileName)) {
      return;
    }
    const document = vault.documents[fileName];
    const relativePath = document?.relativeFilePath;
    if (!relativePath) {
      return;
    }
    graphInfoMap[relativePath] = buildGraphInfo(
      vault,
      fileName,
      tags,
      relativePath,
      options
    );
  });

  const globalData: VaultusaurusGlobalData = {
    graphInfo: graphInfoMap,
    graphStyle: options.graphStyle || {},
    globalGraphInfo: buildGlobalGraph(graphInfoMap),
  };

  setGlobalData(globalData);
}
