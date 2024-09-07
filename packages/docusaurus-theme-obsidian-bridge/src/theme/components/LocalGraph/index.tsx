import { usePluginData } from "@docusaurus/useGlobalData";
import { ObsidianNoteLink, ObsidianNoteNode } from "@site/src/types";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { FC, useEffect, useRef, useState } from "react";
import { GraphInfo } from "../../../../../docusaurus-obsidian-bridge-common/src/types";
import styles from "../../css/index.module.css";
import BridgeLink from "./BridgeLink";
import BridgeNode from "./BridgeNode";

const WIDTH = 240;
const HEIGHT = 240;
const LINK_DISTANCE = 40;
function isNode(
  node: string | number | ObsidianNoteNode
): node is ObsidianNoteNode {
  return typeof node === "object" && "x" in node && "y" in node;
}

const LocalGraph: FC = () => {
  const svgRef = useRef(null);
  const graphData: GraphInfo = usePluginData(
    "docusaurus-plugin-obsidian-bridge"
  )[window.location.pathname];

  const [nodes, setNodes] = useState<ObsidianNoteNode[]>(
    graphData?.nodes || []
  );
  const [links, setLinks] = useState<ObsidianNoteLink[]>(
    graphData?.links || []
  );

  useEffect(() => {
    if (!graphData?.nodes || !graphData?.links) {
      return;
    }

    const simulation = forceSimulation<ObsidianNoteNode, ObsidianNoteLink>(
      nodes
    )
      .force(
        "link",
        forceLink<ObsidianNoteNode, ObsidianNoteLink>(links)
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
      )
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("charge", forceManyBody())
      .force("collision", forceCollide())
      .on("tick", () => {
        setNodes([...simulation.nodes()]);
        setLinks([...links]);
      });

    return () => {
      simulation.stop();
    };
  }, [graphData, nodes, links]);

  return (
    <svg className={styles.container} ref={svgRef}>
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
  );
};

export default LocalGraph;
