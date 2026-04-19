import type { Find, Replace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";
import { OBSIDIAN_INTERNAL_LINK_REGEX } from "../../common/constants";
import type { ObsidianVaultInfo } from "../../common/types";

export default (metadata: ObsidianVaultInfo): [Find, Replace?] => [
  OBSIDIAN_INTERNAL_LINK_REGEX,
  function (input: string) {
    const reference = input.slice(2, -2);
    const url = metadata.documents[reference]?.relativeFilePath ?? reference;
    return u("link", {
      url,
      children: [u("text", reference)],
    });
  },
];
