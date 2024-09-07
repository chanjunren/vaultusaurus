import { usePluginData } from "@docusaurus/useGlobalData";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { useEffect, useState } from "react";
import { GraphInfo } from "../../../docusaurus-obsidian-bridge-common/src/types";
import { ObsidianNoteLink, ObsidianNoteNode } from "./types";

const WIDTH = 240;
const HEIGHT = 240;
const LINK_DISTANCE = 50;

export default function useLocalGraph() {
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

  return { nodes, links };
}
