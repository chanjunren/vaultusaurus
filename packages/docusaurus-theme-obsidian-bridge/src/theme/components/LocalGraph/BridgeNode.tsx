import { ObsidianNoteNode } from "@site/src/types";
import { FC } from "react";

type BridgeNodeProps = {
  node: ObsidianNoteNode;
};

const BridgeNode: FC<BridgeNodeProps> = ({ node }) => {
  return (
    <>
      <circle stroke="#fff" strokeWidth={1.5} r={5} cx={node.x} cy={node.y} />
      {/* Render the label as a text element */}
      <text
        x={node.x} // Same x position as the node
        y={node.y - 10} // Adjust y position to place text slightly above the node
        fill="#fff" // Text color
        fontSize={10} // Adjust font size as needed
        textAnchor="middle" // Centers the text horizontally
      >
        {node.label} {/* Render the node's label */}
      </text>
    </>
  );
};

export default BridgeNode;
