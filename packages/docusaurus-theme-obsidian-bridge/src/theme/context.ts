import { createContext } from "react";
import { LocalGraphContext } from "../../../docusaurus-obsidian-bridge-common/src/types";

export const GraphContext = createContext<LocalGraphContext>({
  setHoveredNode: () => {},
  adjacencyMap: {},
  simulation: null,
  updateNode: () => {},
});
