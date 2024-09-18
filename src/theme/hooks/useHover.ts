import { AdjcacencyMap, GraphNodeLinkInfo } from "@vaultusaurus/common/types";
import { ObsidianNoteNode } from "@vaultusaurus/theme/types";
import { useEffect, useState } from "react";

export default function useHover(links: GraphNodeLinkInfo[]) {
  const [hoveredNode, setHoveredNode] = useState<ObsidianNoteNode>(null);
  const [adjacencyMap, setAdjacencyMap] = useState<AdjcacencyMap>({});

  useEffect(() => {
    if (!links || links.length === 0) {
      return;
    }

    const newMap = {};
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
