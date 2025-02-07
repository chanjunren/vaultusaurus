import { ReactElement, useRef } from "react";

import { GraphInfo } from "@vaultusaurus/common/types";
import { useLocalGraph, useZoom } from "@vaultusaurus/plugin/hooks";
import GraphLink from "@vaultusaurus/plugin/theme/GraphLink";
import GraphNode from "@vaultusaurus/plugin/theme/GraphNode";
interface IGraphContent {
  info: GraphInfo;
}

export default function GraphContent({ info }): ReactElement<IGraphContent> {
  const { nodes, links } = useLocalGraph(info);

  const container = useRef(null);
  const { transform } = useZoom(container);
  return (
    <>
      <svg viewBox={`0 0 300 300`} ref={container}>
        <g transform={transform}>
          {links.map((link, idx) => {
            return <GraphLink key={`obsidian-link-${idx}`} link={link} />;
          })}
          {Object.values(nodes).map((node) => (
            <GraphNode key={node.id} node={node} />
          ))}
        </g>
      </svg>
    </>
  );
}
