import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo } from "@vaultusaurus/common/types";
import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useHover, useLocalGraph, useZoom } from "@vaultusaurus/plugin/hooks";
import GraphLink from "@vaultusaurus/plugin/theme/GraphLink";
import GraphNode from "@vaultusaurus/plugin/theme/GraphNode";
import { useRef } from "react";

// TODO:
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph() {
  const rawData: GraphInfo = usePluginData("docusaurus-plugin-vaultusaurus")[
    window.location.pathname
  ];

  const { nodes, links, simulation, updateNode } = useLocalGraph(rawData);
  const container = useRef(null);
  const { transform } = useZoom(container);
  const rawLinks = rawData?.links || [];

  return (
    <GraphContext.Provider
      value={{ ...useHover(rawLinks), simulation, updateNode }}
    >
      <svg className={styles.container} viewBox={`0 0 300 300`} ref={container}>
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
