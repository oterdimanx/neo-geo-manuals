import { TextBlock } from "@/types/ManualLayout";

type Props = {
    blocks: TextBlock[];
};

export default function TemplatePreview({ blocks }: Props) {
  return (
    <div className="relative w-64 h-90 border border-gray-400 bg-white shadow-md overflow-hidden rounded-lg">
      {blocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: "absolute",
            left: block.x,
            top: block.y,
            width: block.width,
            height: block.height,
            transform: `rotate(${block.rotation || 0}deg)`,
            fontFamily: block.fontFamily,
            fontSize: block.fontSize,
            color: block.color,
          }}
          className="overflow-hidden p-1 border border-black text-xs bg-white"
        >
          {block.content}
        </div>
      ))}
    </div>
  );
}