import { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";
import { OBSIDIAN_INTERNAL_LINK_REGEX } from "../../common/constants";
import { ObsidianVaultInfo } from "../../common/types";

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
