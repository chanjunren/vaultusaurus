import { ObsidianNoteNode } from "@site/src/types";
import { FC } from "react";

type BridgeNodeProps = {
  node: ObsidianNoteNode;
};

const BridgeNode: FC<BridgeNodeProps> = ({ node }) => {
  return (
    <>
      <circle
        stroke="#fff"
        fill="#fff"
        strokeWidth={1.5}
        r={5}
        cx={node.x}
        cy={node.y}
      />
      {/* Render the label as a text element */}
      <text
        x={node.x}
        y={node.y + 20}
        fill="#fff"
        fontSize={10}
        textAnchor="middle"
      >
        {node.label} {/* Render the node's label */}
      </text>
    </>
  );
};

export default BridgeNode;
