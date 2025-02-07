import { IGraphContext } from "@vaultusaurus/plugin/types";

import { createContext } from "react";

export const GraphContext = createContext<IGraphContext>({
  hoverManager: {
    hoveredNode: null,
    setHoveredNode: () => {},
    adjacencyMap: {},
  },
  graphManager: {
    nodes: {},
    links: [],
    simulation: null,
    expanded: false,
    setExpanded: () => {},
    containerWidth: 0,
    containerHeight: 0,
  },
  graphStyle: {},
});
