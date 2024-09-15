import { createContext } from "react";
import { LocalGraphContext } from "./types";

export const GraphContext = createContext<LocalGraphContext>({
  setHoveredNode: () => {},
  adjacencyMap: {},
  simulation: null,
});
