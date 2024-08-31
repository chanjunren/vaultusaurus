import path from "path";

export const OBSIDIAN_TAG_REGEX = /#\S+/g;

export const OBSIDIAN_INTERNAL_LINK_REGEX = /(?<!!)\[\[.*?\]\]/g;

export const REMARK_OBSIDIAN_BRIDGE_INPUT = "remarkObsidianBridgeInput.json";

export const OBSIDIAN_FILE_ID_PREFIX = "obs-doc";
export const OBSIDIAN_TAG_ID_PREFIX = "obs-tag";

export const OBSIDIAN_BRIDGE_PLUGIN_FILES_PREFIX =
  ".docusaurus/docusaurus-plugin-obsidian-bridge/default";

export const localGraphInfoFile = (path: string) => {
  let fileSuffix = path;
  if (fileSuffix.charAt(0) === "/") {
    fileSuffix = fileSuffix.slice(1, fileSuffix.length);
  }
  return fileSuffix.replace(/\//g, "_");
};

export const localGraphInfoFileLocation = (input: string) => {
  return path.join(
    process.env.PWD as string,
    `.docusaurus/docusaurus-plugin-obsidian-bridge/default/${localGraphInfoFile(
      input
    )}`
  );
};
