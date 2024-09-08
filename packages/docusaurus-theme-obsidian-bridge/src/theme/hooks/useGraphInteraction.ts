import { useEffect, useState } from "react";
import { AdjcacencyMap, ObsidianNoteLink, ObsidianNoteNode } from "../types";

export default function useGraphInteraction(links: ObsidianNoteLink[]) {
  const [hoveredNode, setHoveredNode] = useState<ObsidianNoteNode>(null);
  const [adjacencyMap, setAdjacencyMap] = useState<AdjcacencyMap>({});

  useEffect(() => {
    if (!links) {
      return;
    }
    const newMap = {};
    links
      // .filter((link) => isNode(link.source) && isNode(link.target))
      .forEach((link) => {
        console.log("PROCESSING", link);
        const sourceNode = link.source as ObsidianNoteNode;
        const targetNode = link.target as ObsidianNoteNode;
        if (!newMap[sourceNode.id]) newMap[sourceNode.id] = new Set();
        if (!newMap[targetNode.id]) newMap[targetNode.id] = new Set();

        newMap[sourceNode.id].add(targetNode.id);
        newMap[targetNode.id].add(sourceNode.id);
      });

    setAdjacencyMap(newMap);
  }, [links]);

  return { hoveredNode, setHoveredNode, adjacencyMap };
}
