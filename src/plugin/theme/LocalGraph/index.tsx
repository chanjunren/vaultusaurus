import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo, VaultusaurusGlobalData } from "@vaultusaurus/common/types";
import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useHover, useLocalGraph, useZoom } from "@vaultusaurus/plugin/hooks";
import GraphLink from "@vaultusaurus/plugin/theme/GraphLink";
import GraphNode from "@vaultusaurus/plugin/theme/GraphNode";
import {
  FALLBACK_ACTIVE_COLOR,
  FALLBACK_BACKGROUND_COLOR,
  FALLBACK_DEFAULT_COLOR,
} from "@vaultusaurus/plugin/utils";
import { ReactElement, useRef } from "react";

// TODO:
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph(): ReactElement {
  const globalData = usePluginData(
    "docusaurus-plugin-vaultusaurus"
  ) as VaultusaurusGlobalData;
  const rawData: GraphInfo = globalData.graphInfo[window.location.pathname];
  const inputGraphStyle = globalData.graphStyle;

  const { nodes, links, simulation } = useLocalGraph(rawData);
  const container = useRef(null);
  const { transform } = useZoom(container);
  const rawLinks = rawData?.links || [];

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
      <svg
        className={styles.container}
        style={
          {
            "--graph-bg":
              globalData.graphStyle.graphBg || FALLBACK_BACKGROUND_COLOR,
          } as React.CSSProperties
        }
        viewBox={`0 0 300 300`}
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
    </GraphContext.Provider>
  );
}
