import { GraphInfo } from "@vaultusaurus/common/types";
import { ObsidianNoteLink, ObsidianNoteNode } from "@vaultusaurus/plugin/types";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  Simulation,
} from "d3-force";
import { useEffect, useMemo, useRef, useState } from "react";

const WIDTH = 240;
const HEIGHT = 240;
const LINK_DISTANCE = 50;

export default function useLocalGraph(rawData: GraphInfo) {
  const graphData = useMemo(() => structuredClone(rawData), [rawData]);

  const [nodes, setNodes] = useState<{ [key: string]: ObsidianNoteNode }>(
    toNodeMap(graphData?.nodes) || {}
  );

  const [links, setLinks] = useState<ObsidianNoteLink[]>(
    prepareNewLinks(graphData, nodes)
  );

  const simulation =
    useRef<Simulation<ObsidianNoteNode, ObsidianNoteLink>>(null);

  useEffect(() => {
    if (!graphData?.nodes) {
      return;
    }

    const currentSimulation = forceSimulation<
      ObsidianNoteNode,
      ObsidianNoteLink
    >(Object.values(nodes))
      .alphaDecay(0.01)
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
        const newNodes = toNodeMap(currentSimulation.nodes());
        setNodes(newNodes);
        setLinks(prepareNewLinks(graphData, newNodes));
      });

    simulation.current = currentSimulation;

    return () => {
      currentSimulation.stop();
    };
  }, [graphData]);

  return { nodes, links, simulation };
}

function toNodeMap(nodes: ObsidianNoteNode[]) {
  const res = {};
  nodes?.forEach((node) => (res[node.id] = node));
  return res;
}

function prepareNewLinks(
  graph: GraphInfo,
  nodes: { [key: string]: ObsidianNoteNode }
): ObsidianNoteLink[] {
  return (
    graph?.links?.map((link) => ({
      source: nodes[link.source],
      target: nodes[link.target],
    })) || []
  );
}
