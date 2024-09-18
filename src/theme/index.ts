import type { Plugin } from "@docusaurus/types";
import path from "path";

export default function docusaurusThemeObsidianBridge(): Plugin<void> {
  return {
    name: "docusaurus-theme-vaultusaurus",
    getThemePath() {
      return path.join(__dirname, "..", "lib", "theme");
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, "..", "src", "theme");
    },
    configureWebpack() {
      return {
        resolve: {
          alias: {
            "@vaultusaurus/theme": path.resolve(__dirname, "../theme"),
            "@vaultusaurus/common": path.resolve(__dirname, "../common"),
          },
        },
      };
    },
  };
}
