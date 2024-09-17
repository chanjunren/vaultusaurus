import { GraphContext } from "@vaultsaurus/theme/context";
import styles from "@vaultsaurus/theme/css/index.module.css";
import useGraphNode from "@vaultsaurus/theme/hooks/useGraphNode";
import { ObsidianNoteNode } from "@vaultsaurus/theme/types";
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
} from "@vaultsaurus/theme/utils";
import { FC, useContext } from "react";

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
          transform={`scale(${imBeingHovered ? 1.5 : 1})`}
          transform-origin={`${node.x}px ${node.y}px`}
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
