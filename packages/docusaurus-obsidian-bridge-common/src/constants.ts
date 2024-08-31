import path = require("path");

export const OBSIDIAN_TAG_REGEX = /#\S+/g;

export const OBSIDIAN_INTERNAL_LINK_REGEX = /(?<!!)\[\[.*?\]\]/g;

export const REMARK_OBSIDIAN_BRIDGE_INPUT = "remarkObsidianBridgeInput.json";

export const OBSIDIAN_FILE_ID_PREFIX = "obs-doc";
export const OBSIDIAN_TAG_ID_PREFIX = "obs-tag";

export const localGraphInfoFileName = (path: string) => {
  let fileSuffix = path;
  if (fileSuffix.charAt(0) === "/") {
    fileSuffix = fileSuffix.slice(1, fileSuffix.length);
  }
  const res = fileSuffix.replace("/", "_");
  console.log("RESSS", res);
  return res;
};

export const localGraphInfoFileLocation = (input: string) => {
  return path.join(
    process.env.PWD as string,
    `.docusaurus/docusaurus-plugin-obsidian-bridge/default/${localGraphInfoFileName(
      input
    )}`
  );
};
