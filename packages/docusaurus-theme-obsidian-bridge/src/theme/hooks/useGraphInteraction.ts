import { useEffect, useState } from "react";
import { GraphNodeLink } from "../../../../docusaurus-obsidian-bridge-common/src/types";
import { AdjcacencyMap, ObsidianNoteNode } from "../types";

export default function useGraphInteraction(links: GraphNodeLink[]) {
  const [hoveredNode, setHoveredNode] = useState<ObsidianNoteNode>(null);
  const [adjacencyMap, setAdjacencyMap] = useState<AdjcacencyMap>({});

  useEffect(() => {
    if (!links) {
      return;
    }
    const newMap = {};
    console.log("EFFECTING");
    links.forEach((link) => {
      if (!newMap[link.source]) {
        newMap[link.source] = new Set();
      }
      if (!newMap[link.target]) {
        newMap[link.target] = new Set();
      }
      newMap[link.source].add(link.target);
      newMap[link.target].add(link.source);
    });

    setAdjacencyMap(newMap);
  }, [links]);

  return { hoveredNode, setHoveredNode, adjacencyMap };
}
