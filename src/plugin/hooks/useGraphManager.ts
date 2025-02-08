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
export default function useGraphManager(
  rawData: GraphInfo,
  global: boolean,
  minimizeCallback?: () => void
) {
  const graphData = useMemo(() => structuredClone(rawData), [rawData]);

  const [nodes, setNodes] = useState<{ [key: string]: ObsidianNoteNode }>(
    toNodeMap(graphData?.nodes) || {}
  );

  const [links, setLinks] = useState<ObsidianNoteLink[]>(
    prepareNewLinks(graphData, nodes)
  );

  const simulation =
    useRef<Simulation<ObsidianNoteNode, ObsidianNoteLink>>(null);

  const [expanded, setExpanded] = useState<boolean>(false);
  const [globalModal, setGlobalModal] = useState<boolean>(false);

  const containerWidth = global ? 1800 : expanded ? 1200 : 280;
  const containerHeight = expanded || global ? (containerWidth * 9) / 16 : 280;
  const LINK_DISTANCE = expanded ? 20 : 10;

  useEffect(() => {
    if (!graphData?.nodes) {
      return;
    }

    const currentSimulation = forceSimulation<
      ObsidianNoteNode,
      ObsidianNoteLink
    >(Object.values(nodes))
      .alphaDecay(0.05)
      .velocityDecay(0.1)
      .force(
        "link",
        forceLink<ObsidianNoteNode, ObsidianNoteLink>(links)
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
          .strength(0.01) // Softer link strength to reduce rigidity
      )
      .force("center", forceCenter(containerWidth / 2, containerHeight / 2)) // Center the graph
      .force("charge", forceManyBody().strength(-5)) // Softer repulsion
      .force("collision", forceCollide().radius(10).strength(0.01)) // Smoother collision
      .on("tick", () => {
        const newNodes = toNodeMap(currentSimulation.nodes());
        setNodes(newNodes);
        setLinks(prepareNewLinks(graphData, newNodes));
      });

    simulation.current = currentSimulation;

    return () => {
      currentSimulation.stop();
    };
  }, [graphData, expanded]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        if (minimizeCallback) {
          minimizeCallback();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    nodes,
    links,
    simulation,
    expanded,
    setExpanded,
    containerWidth,
    containerHeight,
    globalModal,
    setGlobalModal,
  };
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
