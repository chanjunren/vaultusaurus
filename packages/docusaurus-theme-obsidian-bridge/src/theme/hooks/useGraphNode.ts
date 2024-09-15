import { drag } from "d3-drag";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { LocalGraphContext, ObsidianNoteNode } from "../types";

export default function useGraphNode(
  context: LocalGraphContext,
  node: ObsidianNoteNode
) {
  const { hoveredNode, adjacencyMap, simulation } = context;
  const nodeRef = useRef(null);

  const imBeingHovered = hoveredNode?.id === node.id;
  const otherNodeIsHovered = !!hoveredNode?.id;
  const imTheNeighborOfTheOneBeingHovered =
    !imBeingHovered &&
    hoveredNode?.id &&
    adjacencyMap[hoveredNode.id]?.has(node.id);

  const focused = imBeingHovered || imTheNeighborOfTheOneBeingHovered;

  function dragstarted(event) {
    console.log("START", event);
    if (!event.active) simulation.current.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    console.log("DRAGGING");
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    console.log("END");
    if (!event.active) simulation.current.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  useEffect(() => {
    if (nodeRef.current) {
      const currentNode = select(nodeRef.current);
      currentNode.call(
        drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
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
