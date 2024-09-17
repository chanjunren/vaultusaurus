import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";

import {
  OBSIDIAN_BRIDGE_PLUGIN_FILES_PREFIX,
  REMARK_OBSIDIAN_BRIDGE_INPUT,
} from "@vaultsaurus/common/constants";
import { ObsidianVaultInfo } from "@vaultsaurus/common/types";
import {
  admonitionMapper,
  imageReplacer,
  internalLinkReplacer,
  tagReplacer,
} from "@vaultsaurus/remark/core";
import { RemarkDocusaurusObsidianBridgeOptions } from "@vaultsaurus/remark/options";
import fs from "fs";
import path from "path";
import { map } from "unist-util-map";

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
