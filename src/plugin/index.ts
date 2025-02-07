import { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import { VaultusaurusPluginOptions } from "@vaultusaurus/common/options";
import path from "path";
import outputDataForThemeAndRemarkPlugin from "./markdown";

export default async function docusaurusPluginVaultusaurus(
  context: LoadContext,
  opts: PluginOptions
): Promise<Plugin> {
  return {
    name: "docusaurus-plugin-vaultusaurus",

    async contentLoaded({ actions }) {
      outputDataForThemeAndRemarkPlugin(
        context,
        actions,
        opts as VaultusaurusPluginOptions
      );
    },

    getPathsToWatch() {
      return [
        path.join(context.siteDir, "../../vaultusaurus/**/*.{ts,tsx,css}"),
      ];
    },

    getThemePath() {
      return path.join(__dirname, "theme");
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, "..", "..", "src", "plugin", "theme");
    },

    configureWebpack() {
      return {
        resolve: {
          alias: {
            "@vaultusaurus": path.resolve(__dirname, ".."),
          },
        },
      };
    },
  };
}
