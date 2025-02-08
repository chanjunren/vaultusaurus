import { ReactElement, useContext, useRef } from "react";

import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useZoom } from "@vaultusaurus/plugin/hooks";
import CollapseIcon from "@vaultusaurus/plugin/resources/CollapseIcon.svg";
import ExpandIcon from "@vaultusaurus/plugin/resources/ExpandIcon.svg";
import GlobalGraphIcon from "@vaultusaurus/plugin/resources/GlobalGraphIcon.svg";
import GraphLink from "@vaultusaurus/plugin/theme/GraphLink";
import GraphNode from "@vaultusaurus/plugin/theme/GraphNode";
import classNames from "classnames";

interface IGraphContent {
  expandable?: boolean;
  modal?: boolean;
  expanded?: boolean;
  enableGlobalGraph?: boolean;
  callback?: () => void;
}

export default function GraphContent({
  expandable = true,
  modal = false,
  callback = () => {},
  enableGlobalGraph = true,
}): ReactElement<IGraphContent> {
  const { graphStyle, graphManager } = useContext(GraphContext);
  const {
    setExpanded,
    nodes,
    links,
    containerWidth,
    containerHeight,
    setGlobalModal,
  } = graphManager;

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
          className={classNames(styles.iconOverlay, styles.topButton)}
          onClick={() => setExpanded(true)}
        >
          <ExpandIcon />
        </button>
      )}
      {!modal && enableGlobalGraph && (
        <button
          className={classNames(styles.iconOverlay, styles.nextButton)}
          onClick={() => setGlobalModal(true)}
        >
          <GlobalGraphIcon />
        </button>
      )}
      {modal && (
        <button
          className={classNames(styles.iconOverlay, styles.topButton)}
          onClick={() => {
            setExpanded(false);
            callback();
          }}
        >
          <CollapseIcon />
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
