import { LocalGraphContext } from "@vaultsaurus/theme/types";
import { createContext } from "react";

export const GraphContext = createContext<LocalGraphContext>({
  setHoveredNode: () => {},
  adjacencyMap: {},
  simulation: null,
  updateNode: () => {},
});
