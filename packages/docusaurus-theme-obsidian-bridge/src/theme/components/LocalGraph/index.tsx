import { GraphContext } from "../../context";
import styles from "../../css/index.module.css";
import { ObsidianNoteNode } from "../../types";
import useLocalGraph from "../../useLocalGraph";
import BridgeLink from "./BridgeLink";
import BridgeNode from "./BridgeNode";

function isNode(
  node: string | number | ObsidianNoteNode
): node is ObsidianNoteNode {
  return typeof node === "object" && "x" in node && "y" in node;
}

export default function LocalGraph() {
  const { nodes, links } = useLocalGraph();
  return (
    <GraphContext.Provider value={{}}>
      <svg className={styles.container}>
        {nodes.map((node) => (
          <BridgeNode key={node.id} node={node} />
        ))}
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
      </svg>
    </GraphContext.Provider>
  );
}
