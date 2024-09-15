import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo } from "../../../../../docusaurus-obsidian-bridge-common/src/types";
import { GraphContext } from "../../context";
import styles from "../../css/index.module.css";
import useGraphInteraction from "../../hooks/useGraphInteraction";
import useLocalGraph from "../../hooks/useLocalGraph";
import BridgeLink from "./BridgeLink";
import BridgeNode from "./BridgeNode";

// TODO:
// - [ ] Drag
// - [ ] Zoom
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph() {
  const rawData: GraphInfo = usePluginData("docusaurus-plugin-obsidian-bridge")[
    window.location.pathname
  ];

  const { nodes, graphData, simulation } = useLocalGraph(rawData);
  const links = rawData?.links || [];

  return (
    <GraphContext.Provider
      value={{ ...useGraphInteraction(links), simulation }}
    >
      <svg className={styles.container} viewBox={`0 0 300 300`}>
        {graphData.links.map((link, idx) => {
          return <BridgeLink key={`obsidian-link-${idx}`} link={link} />;
        })}
        {nodes.map((node) => (
          <BridgeNode key={node.id} node={node} />
        ))}
      </svg>
    </GraphContext.Provider>
  );
}
