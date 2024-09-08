import { useEffect, useState } from "react";
import { GraphInfo } from "../../../../docusaurus-obsidian-bridge-common/src/types";
import { ObsidianNoteNode } from "../types";

export default function useGraphInteraction(graphData: GraphInfo) {
  const [hoveredNode, setHoveredNode] = useState<ObsidianNoteNode>(null);
  const [adjacencyMap, setAdjacencyMap] = useState<{
    [key: string]: Set<string>;
  }>(null);

  useEffect(() => {
    if (!graphData?.links) {
      return;
    }
    graphData.links.forEach((link) => {
      adjacencyMap[link.source] = new Set([
        ...adjacencyMap[link.source],
        link.target,
      ]);

      adjacencyMap[link.target] = new Set([
        ...adjacencyMap[link.target],
        link.source,
      ]);
    });
  }, [graphData]);

  return { hoveredNode, setHoveredNode, adjacencyMap };
}
