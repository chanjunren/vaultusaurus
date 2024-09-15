import type { Plugin } from "@docusaurus/types";
import path from "path";

export default function docusaurusThemeObsidianBridge(): Plugin<void> {
  return {
    name: "docusaurus-theme-obsidian-bridge",
    getThemePath() {
      return "../src/theme";
    },
    getTypeScriptThemePath() {
      return "../src/theme";
    },
    configureWebpack() {
      return {
        resolve: {
          alias: {
            "@theme": path.resolve(__dirname, "../src/theme"),
          },
        },
      };
    },
  };
}
