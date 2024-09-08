import { ObsidianNoteNode } from "@site/src/types";
import { FC, useContext } from "react";
import { GraphContext } from "../../context";

type BridgeNodeProps = {
  node: ObsidianNoteNode;
};

const BridgeNode: FC<BridgeNodeProps> = ({ node }) => {
  const { hoveredNode, setHoveredNode } = useContext(GraphContext);
  const imBeingHovered = hoveredNode?.id === node.id;
  const otherNodeIsHovered = !!hoveredNode?.id;

  return !!node.x && !!node.y ? (
    <>
      <circle
        onMouseEnter={() => setHoveredNode(node)}
        onMouseLeave={() => imBeingHovered && setHoveredNode(null)}
        stroke="#fff"
        fill={imBeingHovered ? "#fff" : "#f00"}
        opacity={otherNodeIsHovered && !imBeingHovered ? 0.1 : 1}
        strokeWidth={1.5}
        r={5}
        cx={node.x}
        cy={node.y}
      />
      {/* Render the label as a text element */}
      <text
        x={node.x}
        y={node.y + 20}
        fill="#fff"
        opacity={otherNodeIsHovered && !imBeingHovered ? 0.1 : 1}
        fontSize={10}
        textAnchor="middle"
      >
        {node.label} {/* Render the node's label */}
      </text>
    </>
  ) : null;
};

export default BridgeNode;
