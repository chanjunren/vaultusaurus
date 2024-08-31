import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";

import fs from "fs";
import path from "path";
import { map } from "unist-util-map";
import {
  OBSIDIAN_BRIDGE_PLUGIN_FILES_PREFIX,
  REMARK_OBSIDIAN_BRIDGE_INPUT,
} from "../../docusaurus-obsidian-bridge-common/src/constants";
import { ObsidianVaultInfo } from "../../docusaurus-obsidian-bridge-common/src/types";
import admonitionMapper from "./features/admonition";
import imageReplacer from "./features/img";
import { internalLinkReplacer } from "./features/internalLink";
import tagReplacer from "./features/tag";
import { RemarkDocusaurusObsidianBridgeOptions } from "./types";

export default function convertToDocusaurusMdx(
  options: RemarkDocusaurusObsidianBridgeOptions
) {
  const metadataPath = path.join(
    process.env.PWD,
    `${OBSIDIAN_BRIDGE_PLUGIN_FILES_PREFIX}/${REMARK_OBSIDIAN_BRIDGE_INPUT}`
  );
  const metadata = retrieveMetadata();

  return async (ast: Nodes) => {
    const result = map(ast, admonitionMapper);

    findAndReplace(result, [
      ...(options?.customReplacers || []),
      imageReplacer,
      tagReplacer,
      internalLinkReplacer(metadata),
    ]);
    return result;
  };

  function retrieveMetadata(): ObsidianVaultInfo {
    if (!fs.existsSync(metadataPath)) {
      throw new Error(
        `🐞 Missing ${REMARK_OBSIDIAN_BRIDGE_INPUT} - Please use this plugin in conjunction with docusaurus-plugin-obsidian-bridge`
      );
    }

    return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  }
}
