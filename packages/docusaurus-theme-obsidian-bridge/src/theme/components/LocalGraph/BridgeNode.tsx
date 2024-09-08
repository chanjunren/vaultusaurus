import { FC, useContext } from "react";
import { GraphContext } from "../../context";
import styles from "../../css/index.module.css";
import { ObsidianNoteNode } from "../../types";
import { DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR } from "../../utils";

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
      <a href={node.type === "DOCUMENT" ? node.path : undefined}>
        <circle
          className={styles.graphComponent}
          onMouseEnter={() => setHoveredNode(node)}
          onMouseLeave={() => imBeingHovered && setHoveredNode(null)}
          fill={
            imBeingHovered ? DEFAULT_PRIMARY_COLOR : DEFAULT_SECONDARY_COLOR
          }
          stroke={
            imBeingHovered ? DEFAULT_PRIMARY_COLOR : DEFAULT_SECONDARY_COLOR
          }
          opacity={otherNodeIsHovered && !focused ? 0.1 : 1}
          strokeWidth={1.5}
          r={5}
          cx={node.x}
          cy={node.y}
        />
      </a>
      <text
        className={styles.graphComponent}
        x={node.x}
        y={node.y + 20}
        fill={DEFAULT_SECONDARY_COLOR}
        opacity={otherNodeIsHovered && !focused ? 0.1 : 1}
        fontSize={10}
        textAnchor="middle"
      >
        {node.type === "DOCUMENT" ? node.label : `#${node.label}`}
      </text>
    </>
  ) : null;
};

export default BridgeNode;
