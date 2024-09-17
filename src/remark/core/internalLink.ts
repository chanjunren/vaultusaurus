import { OBSIDIAN_INTERNAL_LINK_REGEX } from "@vaultsaurus/common/constants";
import { ObsidianVaultInfo } from "@vaultsaurus/common/types";
import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";

export default (metadata: ObsidianVaultInfo): [Find, Replace?] => [
  OBSIDIAN_INTERNAL_LINK_REGEX,
  function (input) {
    const reference = input.slice(2, -2);
    return u("link", {
      url: metadata.documents[reference].relativeFilePath,
      children: [u("text", reference)],
    });
  },
];
