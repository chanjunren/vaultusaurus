import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo } from "../../../../../docusaurus-obsidian-bridge-common/src/types";
import { GraphContext } from "../../context";
import styles from "../../css/index.module.css";
import useGraphInteraction from "../../hooks/useGraphInteraction";
import useLocalGraph from "../../hooks/useLocalGraph";
import { ObsidianNoteNode } from "../../types";
import { isNode } from "../../utils";
import BridgeLink from "./BridgeLink";
import BridgeNode from "./BridgeNode";

// TODO:
// - [ ] Zoom
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph() {
  const graphData: GraphInfo = usePluginData(
    "docusaurus-plugin-obsidian-bridge"
  )[window.location.pathname];

  const { nodes, links } = useLocalGraph(graphData);

  return (
    <GraphContext.Provider value={useGraphInteraction(graphData?.links || [])}>
      <svg className={styles.container}>
        {links
          .filter((link) => isNode(link.source) && isNode(link.target))
          .map((link) => (
            <BridgeLink
              key={`${(link.source as ObsidianNoteNode).id}-${
                (link.target as ObsidianNoteNode).id
              }`}
              link={link}
            />
          ))}
        {nodes.map((node) => (
          <BridgeNode key={node.id} node={node} />
        ))}
      </svg>
    </GraphContext.Provider>
  );
}
