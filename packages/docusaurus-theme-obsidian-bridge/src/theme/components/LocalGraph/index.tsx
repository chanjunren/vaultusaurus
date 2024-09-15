import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo } from "../../../../../docusaurus-obsidian-bridge-common/src/types";
import { GraphContext } from "../../context";
import styles from "../../css/index.module.css";
import useHover from "../../hooks/useHover";
import useLocalGraph from "../../hooks/useLocalGraph";
import BridgeLink from "./BridgeLink";
import BridgeNode from "./BridgeNode";

// TODO:
// - [ ] Zoom
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph() {
  const rawData: GraphInfo = usePluginData("docusaurus-plugin-obsidian-bridge")[
    window.location.pathname
  ];

  const { nodes, links, simulation, updateNode } = useLocalGraph(rawData);
  const rawLinks = rawData?.links || [];

  return (
    <GraphContext.Provider
      value={{ ...useHover(rawLinks), simulation, updateNode }}
    >
      <svg className={styles.container} viewBox={`0 0 300 300`}>
        {links.map((link, idx) => {
          return <BridgeLink key={`obsidian-link-${idx}`} link={link} />;
        })}
        {Object.values(nodes).map((node) => (
          <BridgeNode key={node.id} node={node} />
        ))}
      </svg>
    </GraphContext.Provider>
  );
}
