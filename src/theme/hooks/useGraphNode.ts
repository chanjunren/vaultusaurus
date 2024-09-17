import { LocalGraphContext, ObsidianNoteNode } from "@vaultsaurus/theme/types";
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
    if (!event.active) simulation.current.alphaTarget(0.1).restart();
    updateNode(node.id, {
      fx: event.x,
      fy: event.y,
    });
  }
  function dragged(event) {
    updateNode(node.id, {
      fx: event.x,
      fy: event.y,
    });
  }

  function dragEnded() {
    updateNode(node.id, {
      fx: null,
      fy: null,
    });
  }

  useEffect(() => {
    if (nodeRef.current) {
      const currentNode = select(nodeRef.current);
      currentNode.call(
        drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded)
      );
    }
  }, [nodeRef.current]);

  return {
    imBeingHovered,
    otherNodeIsHovered,
    focused,
    nodeRef,
  };
}
