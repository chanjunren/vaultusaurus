import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo, VaultusaurusGlobalData } from "@vaultusaurus/common/types";
import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useHover, useLocalGraph, useZoom } from "@vaultusaurus/plugin/hooks";
import ExpandIcon from "@vaultusaurus/plugin/resources/ExpandIcon.svg";
import GraphLink from "@vaultusaurus/plugin/theme/GraphLink";
import GraphNode from "@vaultusaurus/plugin/theme/GraphNode";
import {
  FALLBACK_ACTIVE_COLOR,
  FALLBACK_BACKGROUND_COLOR,
  FALLBACK_DEFAULT_COLOR,
} from "@vaultusaurus/plugin/utils";
import { ReactElement, useRef } from "react";

interface ILocalGraph {
  customGraph?: GraphInfo;
}

export default function LocalGraph({ customGraph }): ReactElement<ILocalGraph> {
  const globalData = usePluginData(
    "docusaurus-plugin-vaultusaurus"
  ) as VaultusaurusGlobalData;
  const graphInfo: GraphInfo =
    globalData.graphInfo[window.location.pathname] || customGraph;

  if (!graphInfo) {
    return null;
  }

  const inputGraphStyle = globalData.graphStyle;

  const { nodes, links, simulation } = useLocalGraph(graphInfo);
  const container = useRef(null);
  const { transform } = useZoom(container);
  const rawLinks = graphInfo?.links || [];

  return (
    <GraphContext.Provider
      value={{
        ...useHover(rawLinks),
        simulation,
        graphStyle: {
          activeColor: inputGraphStyle.activeColor || FALLBACK_ACTIVE_COLOR,
          defaultColor: inputGraphStyle.defaultColor || FALLBACK_DEFAULT_COLOR,
        },
      }}
    >
      <div
        className={styles.container}
        style={
          {
            "--graph-bg":
              globalData.graphStyle.graphBg || FALLBACK_BACKGROUND_COLOR,
          } as React.CSSProperties
        }
      >
        <ExpandIcon
          className={styles.expandIcon}
          style={{
            color: FALLBACK_DEFAULT_COLOR,
          }}
        />

        <svg viewBox={`0 0 300 300`} ref={container}>
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
    </GraphContext.Provider>
  );
}
