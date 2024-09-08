import { FC, useContext } from "react";
import { GraphContext } from "../../context";
import { ObsidianNoteLink, ObsidianNoteNode } from "../../types";

type BridgeLinkProps = {
  link: ObsidianNoteLink;
};

const BridgeLink: FC<BridgeLinkProps> = ({ link }) => {
  const source = link.source as ObsidianNoteNode;
  const target = link.target as ObsidianNoteNode;
  const { hoveredNode } = useContext(GraphContext);
  const someNodeisHovered = hoveredNode?.id;
  const focused =
    someNodeisHovered &&
    (hoveredNode.id === source.id || hoveredNode.id === target.id);

  return (
    <line
      stroke="#fff"
      opacity={someNodeisHovered && !focused ? 0.2 : 1}
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
