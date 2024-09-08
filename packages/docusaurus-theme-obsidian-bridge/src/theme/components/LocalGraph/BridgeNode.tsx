import { ObsidianNoteNode } from "@site/src/types";
import { FC, useContext } from "react";
import { GraphContext } from "../../context";

type BridgeNodeProps = {
  node: ObsidianNoteNode;
};

const BridgeNode: FC<BridgeNodeProps> = ({ node }) => {
  const { hoveredNode, setHoveredNode, adjacencyMap } =
    useContext(GraphContext);
  const imBeingHovered = hoveredNode?.id === node.id;
  const otherNodeIsHovered = !!hoveredNode?.id;
  const imTheNeighborOfTheOneBeingHovered =
    !imBeingHovered &&
    hoveredNode?.id &&
    adjacencyMap[hoveredNode.id]?.has(node.id);

  const focused = imBeingHovered || imTheNeighborOfTheOneBeingHovered;

  return !!node.x && !!node.y ? (
    <>
      <circle
        onMouseEnter={() => setHoveredNode(node)}
        onMouseLeave={() => imBeingHovered && setHoveredNode(null)}
        stroke="#fff"
        fill={"#fff"}
        opacity={otherNodeIsHovered && !focused ? 0.1 : 1}
        strokeWidth={1.5}
        r={5}
        cx={node.x}
        cy={node.y}
      />
      <text
        x={node.x}
        y={node.y + 20}
        fill="#fff"
        opacity={otherNodeIsHovered && !focused ? 0.1 : 1}
        fontSize={10}
        textAnchor="middle"
      >
        {node.label}
      </text>
    </>
  ) : null;
};

export default BridgeNode;
