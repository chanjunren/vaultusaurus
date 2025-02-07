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
  },
  graphStyle: {},
});
