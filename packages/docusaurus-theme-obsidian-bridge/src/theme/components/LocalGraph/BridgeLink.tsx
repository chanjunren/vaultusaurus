import { ObsidianNoteLink, ObsidianNoteNode } from "@site/src/types";
import { FC } from "react";

type BridgeLinkProps = {
  link: ObsidianNoteLink;
};

function isNode(
  node: string | number | ObsidianNoteNode
): node is ObsidianNoteNode {
  return typeof node === "object" && "x" in node && "y" in node;
}

const BridgeLink: FC<BridgeLinkProps> = ({ link }) => {
  return isNode(link.source) && isNode(link.target) ? (
    <line
      stroke="#fff"
      strokeWidth={3}
      strokeOpacity={1}
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
    />
  ) : null;
};

export default BridgeLink;
