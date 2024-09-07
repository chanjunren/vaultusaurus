import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import {
  GraphNode,
  ObsidianVaultInfo,
} from "../../../docusaurus-obsidian-bridge-common/src/types";

export type ObsidianNoteNode = SimulationNodeDatum & GraphNode;
export type ObsidianNoteLink = SimulationLinkDatum<ObsidianNoteNode>;
export type GraphContextType = {
  focusedNode?: ObsidianNoteNode;
  vaultInfo?: ObsidianVaultInfo;
};
