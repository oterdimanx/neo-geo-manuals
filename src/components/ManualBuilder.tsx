import React, { useState } from "react";
import { Rnd } from "react-rnd";

type BlockType = {
  id: string;
  type: "text" | "image";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const ManualBuilder = () => {
  const [blocks, setBlocks] = useState<BlockType[]>([
    {
      id: "1",
      type: "text",
      content: "Game Title",
      x: 100,
      y: 100,
      width: 300,
      height: 100,
    },
  ]);

  const addTextBlock = () => {
    setBlocks([
      ...blocks,
      {
        id: Date.now().toString(),
        type: "text",
        content: "New text block",
        x: 200,
        y: 200,
        width: 200,
        height: 80,
      },
    ]);
  };

  const addImageBlock = () => {
    setBlocks([
      ...blocks,
      {
        id: Date.now().toString(),
        type: "image",
        content: "https://via.placeholder.com/300x150.png?text=Image",
        x: 250,
        y: 250,
        width: 300,
        height: 150,
      },
    ]);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button onClick={addTextBlock} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Text Block
        </button>
        <button onClick={addImageBlock} className="bg-green-600 text-white px-4 py-2 rounded">
          + Image Block
        </button>
      </div>

      {/* Page canvas */}
      <div
        className="relative bg-white border border-gray-300 shadow-md"
        style={{ width: 712, height: 712 }} // Half size for dev: 1425px @ 300dpi → 712px @ 150dpi
      >
        {blocks.map((block) => (
          <Rnd
            key={block.id}
            default={{
              x: block.x,
              y: block.y,
              width: block.width,
              height: block.height,
            }}
            bounds="parent"
            onDragStop={(e, d) => {
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === block.id ? { ...b, x: d.x, y: d.y } : b
                )
              );
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === block.id
                    ? {
                        ...b,
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y,
                      }
                    : b
                )
              );
            }}
          >
            <div className="w-full h-full bg-gray-100 border border-dashed border-gray-400 overflow-hidden">
              {block.type === "text" ? (
                <textarea
                  className="w-full h-full p-2 bg-transparent resize-none outline-none text-sm"
                  value={block.content}
                  onChange={(e) =>
                    setBlocks((prev) =>
                      prev.map((b) =>
                        b.id === block.id ? { ...b, content: e.target.value } : b
                      )
                    )
                  }
                />
              ) : (
                <img
                  src={block.content}
                  alt="block"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default ManualBuilder;