import { LocalGraphContext, ObsidianNoteNode } from "../types";

export default function useGraphNode(
  context: LocalGraphContext,
  node: ObsidianNoteNode
) {
  const { hoveredNode, setHoveredNode, adjacencyMap } = context;

  const imBeingHovered = hoveredNode?.id === node.id;
  const otherNodeIsHovered = !!hoveredNode?.id;
  const imTheNeighborOfTheOneBeingHovered =
    !imBeingHovered &&
    hoveredNode?.id &&
    adjacencyMap[hoveredNode.id]?.has(node.id);

  const focused = imBeingHovered || imTheNeighborOfTheOneBeingHovered;

  return {
    imBeingHovered,
    otherNodeIsHovered,
    focused,
  };
}
