import { PluginContentLoadedActions } from "@docusaurus/types";
import { VaultusaurusPluginOptions } from "../../common/options";
import {
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
    const relativePath = vault.documents[fileName].relativeFilePath;
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
