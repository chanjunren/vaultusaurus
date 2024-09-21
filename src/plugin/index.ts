import { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import VaultusaurusPluginOptions from "@vaultusaurus/plugin/options";
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
