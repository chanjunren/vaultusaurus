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
// - [ ] Drag
// - [ ] Zoom
// - [ ] Customizations
// - [ ] Modal
// - [ ] Custom popup when clicking on node

export default function LocalGraph() {
  const rawData: GraphInfo = usePluginData("docusaurus-plugin-obsidian-bridge")[
    window.location.pathname
  ];

  const { nodes, links } = useLocalGraph(rawData);

  return (
    <GraphContext.Provider value={useGraphInteraction(rawData?.links || [])}>
      <svg className={styles.container} viewBox={`0 0 300 300`}>
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
