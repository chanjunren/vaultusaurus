import { GraphContext } from "@theme/context";
import styles from "@theme/css/index.module.css";
import useGraphNode from "@theme/hooks/useGraphNode";
import { FC, useContext } from "react";
import { ObsidianNoteNode } from "../../../../../docusaurus-obsidian-bridge-common/src/types";
import { DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR } from "../../utils";

type GraphNodeProps = {
  node: ObsidianNoteNode;
};

const GraphNode: FC<GraphNodeProps> = ({ node }) => {
  const context = useContext(GraphContext);
  const { setHoveredNode } = context;
  const { imBeingHovered, otherNodeIsHovered, focused, nodeRef } = useGraphNode(
    context,
    node
  );

  return !!node.x && !!node.y ? (
    <>
      <a href={node.type === "DOCUMENT" ? node.path : undefined}>
        <circle
          ref={nodeRef}
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

export default GraphNode;
