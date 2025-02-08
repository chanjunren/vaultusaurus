import { ReactElement, useContext, useRef } from "react";

import { GraphStyle } from "@vaultusaurus/common/options";
import {
  GraphInfo,
  GraphNodeInfo,
  GraphNodeLinkInfo,
} from "@vaultusaurus/common/types";
import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useZoom } from "@vaultusaurus/plugin/hooks";
import CollapseIcon from "@vaultusaurus/plugin/resources/CollapseIcon.svg";
import ExpandIcon from "@vaultusaurus/plugin/resources/ExpandIcon.svg";
import GraphLink from "@vaultusaurus/plugin/theme/GraphLink";
import GraphNode from "@vaultusaurus/plugin/theme/GraphNode";

interface IGraphContent {
  info: GraphInfo;
  modal: boolean;
  style: GraphStyle;
  nodes: GraphNodeInfo[];
  links: GraphNodeLinkInfo[];
  expanded: boolean;
  setExpanded: () => void;
}

export default function GraphContent({
  expandable = true,
  modal = false,
}): ReactElement<IGraphContent> {
  const { graphStyle, graphManager } = useContext(GraphContext);
  const { setExpanded, nodes, links, containerWidth, containerHeight } =
    graphManager;

  const inlineStyles = {
    "--vaultusaurus-graph-bg": graphStyle.graphBg,
    "--vaultusaurus-default-color": graphStyle.defaultColor,
    "--vaultusaurus-active-color": graphStyle.defaultColor,
  } as React.CSSProperties;

  const container = useRef(null);
  const { transform } = useZoom(container);

  return (
    <div
      className={modal ? styles.modalContainer : styles.container}
      style={inlineStyles}
      onClick={(e) => modal && e.stopPropagation()}
    >
      {!modal && expandable && (
        <button
          className={styles.actionOverlay}
          onClick={() => setExpanded(true)}
        >
          <ExpandIcon className={styles.actionIcon} />
        </button>
      )}
      {modal && (
        <button
          className={styles.actionOverlay}
          onClick={() => setExpanded(false)}
        >
          <CollapseIcon className={styles.actionIcon} />
        </button>
      )}
      <svg
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        preserveAspectRatio="xMidYMid meet"
        ref={container}
      >
        <g transform={transform}>
          {links.map((link, idx) => {
            return <GraphLink key={`obsidian-link-${idx}`} link={link} />;
          })}
          {Object.values(nodes).map((node) => (
            <GraphNode key={node.id} node={node} />
          ))}
        </g>
      </svg>
    </div>
  );
}
