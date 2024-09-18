import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";

import { RemarkVaultusaurusOptions } from "@vaultusaurus/remark/options";
import fs from "fs";
import path from "path";
import { map } from "unist-util-map";
import {
  REMARK_VAULTUSAURUS_INPUT,
  VAULTUSAURUS_PLUGIN_FILES_PREFIX,
} from "../common/constants";
import { ObsidianVaultInfo } from "../common/types";
import {
  admonitionMapper,
  imageReplacer,
  internalLinkReplacer,
  tagReplacer,
} from "./core";

export default function convertToDocusaurusMdx(
  options: RemarkVaultusaurusOptions
) {
  const metadataPath = path.join(
    process.env.PWD,
    `${VAULTUSAURUS_PLUGIN_FILES_PREFIX}/${REMARK_VAULTUSAURUS_INPUT}`
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
        `🐞 Missing ${REMARK_VAULTUSAURUS_INPUT} - Please use this plugin in conjunction with docusaurus-plugin-obsidian-bridge`
      );
    }

    return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  }
}
