import { createContext } from "react";
import { GraphContextType } from "./types";

export const GraphContext = createContext<GraphContextType>({
  setHoveredNode: () => {},
});
