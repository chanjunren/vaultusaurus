import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import useGraphNode from "@vaultusaurus/plugin/hooks/useGraphNode";
import { ObsidianNoteNode } from "@vaultusaurus/plugin/types";
import classNames from "classnames";
import { useContext } from "react";

type GraphNodeProps = {
  node: ObsidianNoteNode;
};

export default function GraphNode({ node }: GraphNodeProps) {
  const context = useContext(GraphContext);
  const { hoverManager, graphStyle } = context;
  const { setHoveredNode } = hoverManager;
  const { imBeingHovered, otherNodeIsHovered, focused, nodeRef } = useGraphNode(
    context,
    node
  );

  const { defaultColor, activeColor } = graphStyle;

  if (!node.x || !node.y) {
    return null;
  }

  return (
    <>
      <a href={node.type === "DOCUMENT" ? node.path : undefined}>
        <circle
          ref={nodeRef}
          className={classNames(styles.graphComponent, styles.node)}
          onMouseEnter={() => setHoveredNode(node)}
          onMouseLeave={() => imBeingHovered && setHoveredNode(null)}
          fill={imBeingHovered ? activeColor : defaultColor}
          stroke={imBeingHovered ? activeColor : defaultColor}
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
        fill={defaultColor}
        opacity={otherNodeIsHovered && !focused ? 0.1 : 1}
        fontSize={10}
        textAnchor="middle"
      >
        {node.type === "DOCUMENT" ? node.label : `#${node.label}`}
      </text>
    </>
  );
}
