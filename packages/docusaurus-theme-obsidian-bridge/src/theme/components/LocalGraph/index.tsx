import { usePluginData } from "@docusaurus/useGlobalData";
import GraphLink from "@theme/components/LocalGraph/GraphLink";
import GraphNode from "@theme/components/LocalGraph/GraphNode";
import { GraphContext } from "@theme/context";
import styles from "@theme/css/index.module.css";
import { useHover, useLocalGraph, useZoom } from "@theme/hooks";
import { useRef } from "react";
import { GraphInfo } from "../../../../../docusaurus-obsidian-bridge-common/src/types";

// TODO:
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph() {
  const rawData: GraphInfo = usePluginData("docusaurus-plugin-obsidian-bridge")[
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
