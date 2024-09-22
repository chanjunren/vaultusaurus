import { LocalGraphContext } from "@vaultusaurus/plugin/types";
import { createContext } from "react";

export const GraphContext = createContext<LocalGraphContext>({
  setHoveredNode: () => {},
  adjacencyMap: {},
  simulation: null,
});
