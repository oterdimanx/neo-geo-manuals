import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextBlock, ImageBlock, ManualLayout } from "../../types/ManualLayout";
import { saveLayout, loadLayout, clearLayout } from "../../utils/layoutStorage";
import { Rnd } from "react-rnd";

export default function ManualEditor() {
  const [layout, setLayout] = useState<ManualLayout>({
    pages: [
      {
        id: uuidv4(),
        blocks: [],
      },
    ],
  });

  useEffect(() => {
    const saved = loadLayout();
    if (saved) {
      setLayout(saved);
    }
  }, []);

  const handleSave = () => {
    saveLayout(layout);
    alert("Layout saved!");
  };

  const handleClear = () => {
    clearLayout();
    setLayout({
      pages: [
        {
          id: uuidv4(),
          blocks: [],
        },
      ],
    });
    alert("Layout cleared.");
  };

  const addTextBlock = () => {
    const newBlock: TextBlock = {
      id: uuidv4(),
      type: "text",
      content: "New Text Block",
      x: 50,
      y: 50,
      width: 200,
      height: 100,
      fontSize: 14,
    };

    const updatedPages: ManualLayout["pages"] = [...layout.pages];
    updatedPages[0].blocks.push(newBlock);
    setLayout({ pages: updatedPages });
  };

  const addImageBlock = () => {
    const newBlock: ImageBlock = {
      id: uuidv4(),
      type: "image",
      src: "",
      x: 50,
      y: 50,
      width: 150,
      height: 150,
    };

    const updatedPages = [...layout.pages];
    updatedPages[0].blocks.push(newBlock);
    console.log('added image block ' + newBlock)
    setLayout({ pages: updatedPages });
  };

  const updateBlockPosition = (id: string, x: number, y: number) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id ? { ...block, x, y } : block
      ),
    }));

    setLayout({ pages: updatedPages });
  };

  const updateBlockSize = (id: string, width: number, height: number, x: number, y: number) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id ? { ...block, width, height, x, y } : block
      ),
    }));

    setLayout({ pages: updatedPages });
  };

  const updateTextBlock = (id: string, value: string) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id && block.type === "text" ? { ...block, content: value } : block
      ),
    }));

    setLayout({ pages: updatedPages });
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPages = layout.pages.map((page) => ({
        ...page,
        blocks: page.blocks.map((block) =>
          block.id === id && block.type === "image"
            ? { ...block, src: reader.result as string }
            : block
        ),
      }));
      setLayout({ pages: updatedPages });
    };
    reader.readAsDataURL(file);
  };

  const deleteBlock = (id: string) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.filter((block) => block.id !== id),
    }));
    setLayout({ pages: updatedPages });
  };
  
  const clearImage = (id: string) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id && block.type === "image" ? { ...block, src: "" } : block
      ),
    }));
    setLayout({ pages: updatedPages });
  };

  const handleExport = () => {
    const json = JSON.stringify(layout, null, 2); // Pretty print the JSON
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "layout.json";
    link.click();
  };
  

  return (
    <div className="p-4 space-y-4 min-h-screen bg-gray-100">
      <h1 className="text-red-500">Manual Editor</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-500 text-white rounded">
          Clear
        </button>
        <button onClick={addTextBlock} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Text Block
        </button>
        <button onClick={addImageBlock} className="px-4 py-2 bg-green-600 text-white rounded">
          Add Image Block
        </button>
        <button onClick={handleExport} className="px-4 py-2 bg-purple-600 text-white rounded">
          Export Layout
        </button>
      </div>

      {/* Editor Zone */}
      <div className="relative min-h-[600px] bg-white border-2 border-dashed border-gray-400 rounded p-2 overflow-auto">
        {layout.pages[0].blocks.map((block) => (
          <Rnd
            key={block.id}
            size={{ width: block.width, height: block.height }}
            position={{ x: block.x, y: block.y }}
            onDragStop={(_, d) => updateBlockPosition(block.id, d.x, d.y)}
            onResizeStop={(_, __, ref, ___, position) =>
              updateBlockSize(block.id, ref.offsetWidth, ref.offsetHeight, position.x, position.y)
            }
            bounds="parent"
            className="border border-gray-300 bg-white p-1 overflow-hidden"
          >
            <div className="relative w-full h-full">
              {/* Delete button */}
              <button
                onClick={() => deleteBlock(block.id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded hover:bg-red-600 z-10"
              >
                ✕
              </button>

              {/* Text Block */}
              {block.type === "text" && (
                <textarea
                  className="w-full h-full resize-none outline-none"
                  style={{ fontSize: (block as TextBlock).fontSize }}
                  value={(block as TextBlock).content}
                  onChange={(e) => updateTextBlock(block.id, e.target.value)}
                />
              )}

              {/* Image Block */}
              {block.type === "image" && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {(block as ImageBlock).src ? (
                    <>
                      <img
                        src={(block as ImageBlock).src}
                        alt="Uploaded"
                        className="w-full h-full object-contain"
                      />
                      {/* Clear Image Button */}
                      <button
                        onClick={() => clearImage(block.id)}
                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                      >
                        Clear Image
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 mb-2">Upload an image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(block.id, e.target.files[0]);
                          }
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}