import { usePluginData } from "@docusaurus/useGlobalData";
import { ObsidianNoteLink, ObsidianNoteNode } from "@site/src/types";
import { forceCenter, forceLink, forceSimulation } from "d3-force";
import { FC, useEffect, useRef, useState } from "react";
import { GraphInfo } from "../../../../../docusaurus-obsidian-bridge-common/src/types";
import BridgeLink from "./BridgeLink";
import BridgeNode from "./BridgeNode";

const RADIUS = 8;
const LINK_DISTANCE = 30;
const FORCE_RADIUS_FACTOR = 1.5;
const NODE_STRENGTH = -50;

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
    if (!graphData.nodes || !graphData.links) {
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
      .force("center", forceCenter(170 / 2, 170 / 2).strength(0.5));
    // .force("charge", forceManyBody().strength(NODE_STRENGTH))
    // .force("collision", forceCollide(RADIUS * FORCE_RADIUS_FACTOR));
    // .force("center", forceCenter(170 / 2, 170 / 2).strength(0.3)) // Reduce strength to prevent a tight grouping

    // .force("charge", forceManyBody().strength(NODE_STRENGTH)) // Repelling force
    // .force("x", forceX(170 / 2).strength(0.1)) // Weaken the horizontal centering force
    // .force("y", forceY(170 / 2).strength(0.1)) // Weaken the vertical centering force
    // .force("collision", forceCollide(RADIUS * FORCE_RADIUS_FACTOR)); // Prevents nodes from overlapping

    // update state on every frame
    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
      setLinks([...links]);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, nodes, links]);

  return (
    <svg ref={svgRef} width={170} height={170}>
      <rect x={0} y={0} width={170} height={170} rx={7} fill={"#272b4d"} />
      {nodes.map((node) => (
        <BridgeNode key={node.id} node={node} />
      ))}
      {links
        .filter((link) => isNode(link.source) && isNode(link.target))
        .map((link) => (
          <BridgeLink key={`${link.source.id}-${link.target.id}`} link={link} />
        ))}
    </svg>
  );
};

export default LocalGraph;
