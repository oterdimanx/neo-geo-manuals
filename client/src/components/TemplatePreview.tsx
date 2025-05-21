import React from "react";
import { TextBlock } from "@/types/ManualLayout";

interface Props {
  blocks: TextBlock[];
}

const TemplatePreview: React.FC<Props> = ({ blocks }) => {
  // Scale down from real units (assuming 1000x1414 like A4-ish size) to preview
  const previewWidth = 300;
  const previewHeight = 424;
  const scaleFactorX = previewWidth / 1000;
  const scaleFactorY = previewHeight / 1414;

  return (
    <div
      style={{
        width: previewWidth,
        height: previewHeight,
        border: "1px solid #ccc",
        position: "absolute",
        backgroundColor: "#fff",
        overflow: "hidden",
        borderRadius: 8,
        zIndex: 100,
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: "relative",
            left: block.x * scaleFactorX,
            top: block.y * scaleFactorY,
            width: block.width * scaleFactorX,
            height: block.height * scaleFactorY,
            transform: `rotate(${block.rotation || 0}deg)`,
            border: "1px solid #999",
            fontFamily: block.fontFamily,
            fontSize: block.fontSize,
            color: block.color,
            padding: 2,
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
            boxSizing: "border-box",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {block.content || "Text"}
        </div>
      ))}
    </div>
  );
};

export default TemplatePreview;