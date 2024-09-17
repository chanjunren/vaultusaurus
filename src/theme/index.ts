import type { Plugin } from "@docusaurus/types";
import path from "path";

export default function docusaurusThemeObsidianBridge(): Plugin<void> {
  return {
    name: "docusaurus-theme-obsidian-bridge",
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
            "@vaultsaurus/theme": path.resolve(__dirname, "../theme"),
            "@vaultsaurus/common": path.resolve(__dirname, "../common"),
          },
        },
      };
    },
  };
}
