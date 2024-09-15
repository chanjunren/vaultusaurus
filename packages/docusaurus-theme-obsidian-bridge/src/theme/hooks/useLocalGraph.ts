import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  Simulation,
} from "d3-force";
import { useEffect, useMemo, useRef, useState } from "react";
import { GraphInfo } from "../../../../docusaurus-obsidian-bridge-common/src/types";
import { ObsidianNoteLink, ObsidianNoteNode } from "../types";

const WIDTH = 240;
const HEIGHT = 240;
const LINK_DISTANCE = 50;

function prepareGraph(rawData: GraphInfo) {}

export default function useLocalGraph(rawData: GraphInfo) {
  const graphData = useMemo(() => structuredClone(rawData), [rawData]);
  const [nodes, setNodes] = useState<ObsidianNoteNode[]>(
    graphData?.nodes || []
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
    >(nodes)
      .alphaDecay(0.01)
      .force(
        "link",
        forceLink<ObsidianNoteNode, ObsidianNoteLink>(graphData?.links || [])
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
      )
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("charge", forceManyBody())
      .force("collision", forceCollide())
      .on("tick", () => {
        setNodes([...currentSimulation.nodes()]);
      });

    simulation.current = currentSimulation;

    return () => {
      currentSimulation.stop();
    };
  }, [graphData]);

  return { nodes, graphData, simulation };
}
