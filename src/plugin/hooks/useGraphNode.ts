import {
  LocalGraphContext,
  ObsidianNoteNode,
} from "@vaultusaurus/plugin/types";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";

export default function useGraphNode(
  context: LocalGraphContext,
  node: ObsidianNoteNode
) {
  const { hoveredNode, adjacencyMap, simulation, updateNode } = context;
  const nodeRef = useRef(null);

  const imBeingHovered = hoveredNode?.id === node.id;
  const otherNodeIsHovered = !!hoveredNode?.id;
  const imTheNeighborOfTheOneBeingHovered =
    !imBeingHovered &&
    hoveredNode?.id &&
    adjacencyMap[hoveredNode.id]?.has(node.id);

  const focused = imBeingHovered || imTheNeighborOfTheOneBeingHovered;

  function dragStarted(event) {
    if (!event.active && simulation.current) {
      simulation.current.alphaTarget(1).restart();
    }
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragEnded(event) {
    event.subject.fx = null;
    event.subject.fy = null;
  }

  useEffect(() => {
    const currentNode = nodeRef.current ? select(nodeRef.current) : undefined;

    if (currentNode) {
      currentNode.datum(node);

      const dragBehavior = drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

      currentNode.call(dragBehavior);
    }

    return () => {
      if (currentNode) {
        currentNode.on(".drag", null);
      }
    };
  }, [nodeRef.current]);

  return {
    imBeingHovered,
    otherNodeIsHovered,
    focused,
    nodeRef,
  };
}
