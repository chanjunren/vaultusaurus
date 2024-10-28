import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { ObsidianNoteLink, ObsidianNoteNode } from "@vaultusaurus/plugin/types";
import { DEFAULT_SECONDARY_COLOR } from "@vaultusaurus/plugin/utils";
import { useContext } from "react";

type GraphLinkProps = {
  link: ObsidianNoteLink;
};

export default function GraphLink({ link }: GraphLinkProps) {
  const source = link.source as ObsidianNoteNode;
  const target = link.target as ObsidianNoteNode;
  const { hoveredNode } = useContext(GraphContext);
  const someNodeIsHovered = hoveredNode?.id;
  const focused =
    someNodeIsHovered &&
    (hoveredNode.id === source.id || hoveredNode.id === target.id);

  if (!source || !target) {
    return null;
  }

  return (
    <line
      stroke={DEFAULT_SECONDARY_COLOR}
      className={styles.graphComponent}
      opacity={someNodeIsHovered && !focused ? 0.2 : 0.6}
      strokeWidth={1}
      strokeOpacity={1}
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
    />
  );
}
