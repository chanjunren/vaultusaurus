import type { Plugin } from "@docusaurus/types";

export default function docusaurusThemeObsidianBridge(): Plugin<void> {
  return {
    name: "docusaurus-theme-obsidian-bridge",
    getThemePath() {
      return "../src/theme";
    },
    getTypeScriptThemePath() {
      return "../src/theme";
    },
  };
}
