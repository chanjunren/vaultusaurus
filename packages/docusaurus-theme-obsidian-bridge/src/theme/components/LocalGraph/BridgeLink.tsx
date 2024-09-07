import { ObsidianNoteLink, ObsidianNoteNode } from "@site/src/types";
import { FC } from "react";

type BridgeLinkProps = {
  link: ObsidianNoteLink;
};

const BridgeLink: FC<BridgeLinkProps> = ({ link }) => {
  const source = link.source as ObsidianNoteNode;
  const target = link.target as ObsidianNoteNode;
  return (
    <line
      stroke="#fff"
      opacity={0.2}
      strokeWidth={3}
      strokeOpacity={1}
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
    />
  );
};

export default BridgeLink;
