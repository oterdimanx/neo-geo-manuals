import { useState, useEffect, useRef, SetStateAction } from "react"
import { v4 as uuidv4 } from "uuid"
import { TextBlock, ImageBlock, ManualLayout, ManualBlock } from "../types/ManualLayout"
import { saveLayout, loadLayout, clearLayout } from "../utils/layoutStorage"
import { Rnd } from "react-rnd"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortablePageThumbnail } from "./SortablePageThumbnail"
import { ZoomIn, ZoomOut, RefreshCw, MoveUp, MoveDown } from "lucide-react"
import FontSelector from './FontSelector'

export default function ManualEditor() {
/*
  const updateContainerHeight = () => {
    const maxBottom = layout.pages[currentPageIndex].blocks.reduce((max, block) => {
      const blockBottom = block.y + block.height;
      return blockBottom > max ? blockBottom : max;
    }, 0);
  
    if (containerRef.current) {
      containerRef.current.style.height = `${maxBottom + 50}px`;
    }
  };
*/
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<ManualBlock | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const GRID_SIZE = 10;
  const [showGrid, setShowGrid] = useState(true)
  const [layout, setLayout] = useState<ManualLayout>({
    pages: [
      {
        id: uuidv4(),
        blocks: [],
      },
    ],
  })

  useEffect(() => {
    // Find the max bottom position of the blocks
    const maxBottom = layout.pages[currentPageIndex].blocks.reduce((max, block) => {
      const blockBottom = block.y + block.height
      return blockBottom > max ? blockBottom : max
    }, 0)
    
    // Set the height of the container dynamically
    if (containerRef.current) {
      containerRef.current.style.height = `${maxBottom + 50}px` // Adding some padding for buffer
    }
  }, [layout, currentPageIndex])

  useEffect(() => {
    const saved = loadLayout()
    if (saved) {
      setLayout(saved)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event : MouseEvent) => {
      if(
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ){
        setShowSidebar(false)
      }
    }
    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleSave = () => {
    saveLayout(layout)
    alert("Layout saved!")
  }

  const handleClear = () => {
    clearLayout();
    setLayout({
      pages: [
        {
          id: uuidv4(),
          blocks: [],
        },
      ],
    })
    alert("Layout cleared.")
  }

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
    }

    const updatedPages: ManualLayout["pages"] = [...layout.pages]
    updatedPages[currentPageIndex].blocks.push(newBlock)
    setLayout({ pages: updatedPages })
  }

  const addImageBlock = () => {
    const newBlock: ImageBlock = {
      id: uuidv4(),
      type: "image",
      src: "",
      x: 50,
      y: 50,
      width: 150,
      height: 150,
    }

    const updatedPages = [...layout.pages]
    updatedPages[currentPageIndex].blocks.push(newBlock)
    //console.log('added image block ' + newBlock)
    setLayout({ pages: updatedPages })
  };

  const updateBlockPosition = (id: string, x: number, y: number) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id ? { ...block, x, y } : block
      ),
    }))

    setLayout({ pages: updatedPages })
  }

  const updateBlockSize = (id: string, width: number, height: number, x: number, y: number) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id ? { ...block, width, height, x, y } : block
      ),
    }))

    setLayout({ pages: updatedPages })
  }

  const updateTextBlock = (id: string, value: string) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id && block.type === "text" ? { ...block, content: value } : block
      ),
    }))

    setLayout({ pages: updatedPages })
  }

  const updateFontSize = (id: string, fontSize: number) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id && block.type === "text" ? { ...block, fontSize } : block
      ),
    }))
    setLayout({ pages: updatedPages })
  };

  const deleteBlock = (id: string) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.filter((block) => block.id !== id),
    }));
    setLayout({ pages: updatedPages })
  };

  const handleBlockClick = (block: ManualBlock) => {
    setSelectedBlockId(block.id)
    setSelectedBlock(block)
    setShowSidebar(true)
  }

  const clearImage = (id: string) => {
    const updatedPages = layout.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === id && block.type === "image" ? { ...block, src: "" } : block
      ),
    }))
    setLayout({ pages: updatedPages })
  }

  const handleExport = () => {
    const json = JSON.stringify(layout, null, 2) // Pretty print the JSON
    const blob = new Blob([json], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "layout.json"
    link.click()
  };
  
  const goToNextPage = () => {
    if (currentPageIndex < layout.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  };

  const addPage = () => {
    const newPage = {
      id: uuidv4(),
      blocks: [],
    };
    const updatedPages = [...layout.pages, newPage]
    setLayout({ pages: updatedPages })
    setCurrentPageIndex(updatedPages.length - 1) // Move to new page
  };

  const removeCurrentPage = () => {
    if (layout.pages.length <= 1) {
      alert("You must have at least one page.")
      return
    }
  
    const updatedPages = layout.pages.filter((_, index) => index !== currentPageIndex)
    const newPageIndex = Math.max(0, currentPageIndex - 1)
    setLayout({ pages: updatedPages })
    setCurrentPageIndex(newPageIndex)
  };

  const clonePage = (index: number) => {
    const pageToClone = layout.pages[index]
  
    const clonedPage = {
      id: uuidv4(),
      blocks: pageToClone.blocks.map((block) => ({
        ...block,
        id: uuidv4(), // Give each block a new unique ID
      })),
    }
  
    const updatedPages = [
      ...layout.pages.slice(0, index + 1),
      clonedPage,
      ...layout.pages.slice(index + 1),
    ]
  
    setLayout({ pages: updatedPages })
    setCurrentPageIndex(index + 1); // Navigate to the cloned page
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
  
    if (!over || active.id === over.id) return
  
    const oldIndex = layout.pages.findIndex(p => p.id === active.id)
    const newIndex = layout.pages.findIndex(p => p.id === over.id)
  
    const newPages = arrayMove(layout.pages, oldIndex, newIndex)
  
    setLayout({
      ...layout,
      pages: newPages,
    })
  }

  function updateBlockOpacity(blockId: string, opacity: number) {
    setLayout(layout => {
      const page = layout.pages[currentPageIndex]
      const updatedBlocks = page.blocks.map(block =>
        block.id === blockId && block.type === "image"
          ? { ...block, opacity }
          : block
      )
  
      const updatedPage = { ...page, blocks: updatedBlocks }
      const updatedPages = [...layout.pages]
      updatedPages[currentPageIndex] = updatedPage
  
      return { ...layout, pages: updatedPages }
    })
  }

  const updateSelectedBlock = (updatedFields: Partial<ManualBlock>) => {
    if (!selectedBlock) return;
  
    const updatedBlock = { ...selectedBlock, ...updatedFields };
  
    const newPages = layout.pages.map((page, pageIndex) => {
      if (pageIndex !== currentPageIndex) return page;
  
      return {
        ...page,
        blocks: page.blocks.map(block =>
          block.id === selectedBlock.id ? updatedBlock : block
        ),
      };
    });
  
    setLayout({ ...layout, pages: newPages });
    setSelectedBlock(updatedBlock); // Keep sidebar in sync
  };

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  /** Cloudinary */
  const handleImageUpload = (id: string, file: File) => {
    // Use Cloudinary's upload widget
    const cloudinaryWidget = window.cloudinary?.createUploadWidget(
      {
        cloudName: 'dk6iosfzk', // Replace with your Cloudinary cloud name
        uploadPreset: 'manual_blocks', // Create an upload preset in your Cloudinary dashboard
        sources: ['local'],
        multiple: false,
        folder: 'manual_images', // Specify the folder in Cloudinary for your images
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png'],
      },
      function (error: any, result: any) {
        if (!error && result && result.event === 'success') {
          // Update layout with new image URL from Cloudinary
          const updatedPages = layout.pages.map((page) => ({
            ...page,
            blocks: page.blocks.map((block) =>
              block.id === id && block.type === 'image'
                ? { ...block, src: result.info.secure_url } // Cloudinary URL
                : block
            ),
          }))
          setLayout({ pages: updatedPages })
        } else {
          alert('Image upload failed!')
        }
      }
    )
  
    cloudinaryWidget.open()
  };

  const openUploadWidget = () => {
    if (!window.cloudinary || !window.cloudinary.createUploadWidget) {
      alert("Cloudinary upload widget not available.")
      return
    }
  
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dk6iosfzk",
        uploadPreset: "manual_blocks", // your unsigned preset name
        sources: ["local", "url"],
        multiple: false,
        cropping: false,
        folder: "manual_images", // optional
      },
      (error: any, result: any) => {
        if (!error && result.event === "success") {
          console.log("Upload success:", result.info)
  
          const newBlock: ImageBlock = {
            id: uuidv4(),
            type: "image",
            src: result.info.secure_url,
            x: 50,
            y: 50,
            width: 200,
            height: 200,
          }
  
          const updatedPages = [...layout.pages]
          updatedPages[currentPageIndex].blocks.push(newBlock)
          setLayout({ pages: updatedPages })
        }
      }
    );
  
    widget.open()
  };

  const openMediaLibrary = (blockId: string) => {
    if (!window.cloudinary || !window.cloudinary.createMediaLibrary) {
      alert("Cloudinary Media Library is not available.")
      return;
    }

    const ml = window.cloudinary?.createMediaLibrary(
      {
        cloud_name: "dk6iosfzk",
        api_key: "232229922537631", // This is safe here — not secret
        remove_header: true,
        inline_container: false,
      },
      {
        insertHandler: (data: any) => {
          if (data.assets && data.assets.length > 0) {
            const selectedUrl = data.assets[0].secure_url;
            const updatedPages = layout.pages.map((page) => ({
              ...page,
              blocks: page.blocks.map((block) =>
                block.id === blockId && block.type === "image"
                  ? { ...block, src: selectedUrl }
                  : block
              ),
            }))
            setLayout({ pages: updatedPages })
          }
        },
      }
    )
  
    ml.show()
  };

  return (
    <div className="p-4 space-y-4 min-h-screen bg-gray-100">
      <h1 className="text-red-500 font-pixel text-2xl">Manual Editor</h1>
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
        <button onClick={openUploadWidget} className="px-4 py-2 bg-indigo-600 text-white rounded">
          Upload Image
        </button>
        <button onClick={goToPreviousPage} className="px-4 py-2 bg-gray-400 text-white rounded">
          Previous Page
        </button>
        <button onClick={goToNextPage} className="px-4 py-2 bg-gray-400 text-white rounded">
          Next Page
        </button>
        <button onClick={addPage} className="px-4 py-2 bg-green-700 text-white rounded">
          Add Page
        </button>
        <button onClick={removeCurrentPage} className="px-4 py-2 bg-red-700 text-white rounded">
          Remove Page
        </button>
        {/* Sidebar toggle button */}
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
          onClick={() => {
            setSelectedBlock(null)
            setSelectedBlockId(null)
            setShowSidebar(!showSidebar)
          }}
        >
          {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
        </button>
        {/* Snap-To-Grid toggle button */}
        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded shadow"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded shadow"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded shadow"
            title="Reset Zoom"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <span className="ml-2 text-sm text-gray-700">
          Page {currentPageIndex + 1} of {layout.pages.length}
        </span>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={layout.pages.map(page => page.id)}
            strategy={verticalListSortingStrategy}
          >
          <div className="w-32 overflow-y-auto bg-gray-200 p-2 space-y-2 border-r border-gray-300">
            {layout.pages.map((page, index) => (
              <SortablePageThumbnail
                key={page.id}
                page={page}
                index={index}
                currentPageIndex={currentPageIndex}
                onSelect={() => setCurrentPageIndex(index)}
                onClone={() => clonePage(index)}
              />
            ))}
          </div>
          </SortableContext>
        </DndContext>
        {/* Editor / Canvas Zone */}
        <div className="flex-1 pl-4">
          <div 
          ref={containerRef}
          className="relative min-h-[600px] overflow-auto border-2 border-dashed border-gray-400 rounded bg-white"
          style={{ 
            minHeight: '600px', 
            height: 'auto',
            transform: `scale(${zoom})`,
            backgroundImage: showGrid ? `linear-gradient(to right, #eee 1px, transparent 1px),
            linear-gradient(to bottom, #eee 1px, transparent 1px)` : "none",
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundColor: layout.pages[currentPageIndex].backgroundColor || "#ffffff"
          }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={layout.pages[currentPageIndex].id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full min-h-[600px]"
              >
                {/** slice & sort will ensure z-index values are respected */}
                <AnimatePresence>
                  {layout.pages[currentPageIndex].blocks
                  .slice()
                  .sort((a,b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
                  .map((block) => (
                    <motion.div
                    key={block.id}
                    onClick={()=>handleBlockClick(block)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                  {containerRef.current && (
                    <Rnd
                    size={{ width: block.width, height: block.height }}
                    position={{ x: block.x, y: block.y }}
                    onDragStart={() => {
                      setDraggingBlockId(block.id)
                      if (containerRef.current) {
                        containerRef.current.style.height = '2000px' // or some large number to allow dragging far
                      }
                    }}
                    onDragStop={(_, d) => {
                      setDraggingBlockId(null)
                      //snap-to-grid
                      const snappedX = snapToGrid(d.x);
                      const snappedY = snapToGrid(d.y);
                      updateBlockPosition(block.id, snappedX, snappedY)

                      // Adjust height after drag ends
                      const maxBottom = layout.pages[currentPageIndex].blocks.reduce((max, block) => {
                        const bottom = block.id === block.id ? d.y + block.height : block.y + block.height;
                        return Math.max(max, bottom);
                      }, 0);

                      if (containerRef.current) {
                        containerRef.current.style.height = `${maxBottom + 50}px`;
                      }
                    }}
                    onResizeStop={(_, __, ref, ___, position) =>
                      {
                        updateBlockSize(block.id, ref.offsetWidth, ref.offsetHeight, position.x, position.y)
                        // Recalculate height after resizing a block
                        //updateContainerHeight()
                      }
                    }
                    bounds={containerRef.current || undefined}
                    className="cursor-pointer border border-gray-300 bg-white p-1 overflow-hidden"
                    style={{
                      zIndex: draggingBlockId === block.id ? 100 : 1,
                      transition: 'box-shadow 0.2s',
                      boxShadow: draggingBlockId === block.id ? '0px 4px 12px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
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
                          style={{ 
                            fontSize: (block as TextBlock).fontSize,
                            fontWeight: block.fontWeight || "normal",
                            fontFamily: block.fontFamily || "sans-serif",
                            fontStyle: block.italic ? "italic" : "normal",
                            color: block.color || "#000", // Default to black if none provided
                           }}
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
                                style={{ opacity: typeof block.opacity === "number" ? block.opacity : 1 }}
                              />
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                                <div className="relative flex items-center justify-center">
                                  {/* Tooltip */}
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-0.5 z-10 pointer-events-none">
                                    {Math.round((block.opacity ?? 1) * 100)}%
                                  </div>

                                  {/* Slider */}
                                  <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={block.opacity ?? 1}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      updateBlockOpacity(block.id, isNaN(value) ? 1 : value);
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    className="w-20 h-2 transform rotate-[-90deg]"
                                  />
                                </div>
                              </div>
                              {/* Clear Image Button */}
                              <button
                                onClick={() => clearImage(block.id)}
                                className="mt-2 text-sm text-red-500 hover:text-red-700"
                              >
                                Clear Image
                              </button>

                              {/* 📁 Choose from Cloudinary Library */}
                              <button
                                onClick={() => openMediaLibrary(block.id)}
                                className="mt-1 text-sm text-blue-500 hover:text-blue-700"
                              >
                                Choose from Library
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
                              <button
                                onClick={() => openMediaLibrary(block.id)}
                                className="mt-1 text-sm text-blue-500 hover:text-blue-700"
                              >
                                Choose from Library
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    </Rnd>
                  )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/** Right Sidebar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={showSidebar ? { width: 320, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden border-l border-gray-200 bg-white p-4"
        >
          {showSidebar && selectedBlockId ? (
            // sidebarRef is used to handle its hiding when user clicks outside the panel
            <div ref={sidebarRef} className="sidebar">
              <h2 className="text-lg font-semibold mb-4">Edit Block</h2>
              <p>Editing block with ID: {selectedBlockId}</p>
              {
                selectedBlock?.type === 'image' && (
                  <div className="mt-2 text-sm text-gray-700">
                    <strong>Image File:</strong> {selectedBlock.src.split("/").pop()}
                  </div>
                )
              }
              {/* block editing UI here */}
              {selectedBlock?.type === "text" && (
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-sm font-medium">Text Content:</span>
                    <textarea
                      value={selectedBlock.content}
                      onChange={e =>
                        updateSelectedBlock({ content: e.target.value } as Partial<TextBlock>)
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Font Size:</span>
                    <input
                      type="number"
                      min={6}
                      max={72}
                      value={selectedBlock.fontSize}
                      onChange={e =>
                        updateSelectedBlock({ fontSize: Number(e.target.value) } as Partial<TextBlock>)
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium mt-2">Font Family</label>
                  <FontSelector
                    value={selectedBlock.fontFamily || "sans-serif"}
                    onChange={(font) =>
                      updateSelectedBlock({ fontFamily: font } as Partial<TextBlock>)
                    }
                  />

                  <label className="block text-sm font-medium mt-2">Font Weight</label>
                  <select
                    value={selectedBlock.fontWeight || "normal"}
                    onChange={(e) =>
                      updateSelectedBlock({ fontWeight: e.target.value as "normal" | "bold" } as Partial<TextBlock>)
                    }
                    className="border rounded px-2 py-1 text-sm w-full"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>

                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={!!selectedBlock.italic}
                      onChange={(e) =>
                        updateSelectedBlock({ italic: e.target.checked } as Partial<TextBlock>)
                      }
                      className="mr-2"
                    />
                  Italic
                </label>

                {/* Font Color Picker */}
                <label className="block text-sm font-medium mt-2">Font Color</label>
                <input
                  type="color"
                  value={selectedBlock.color || "#000000"}
                  onChange={(e) =>
                    updateSelectedBlock({ color: e.target.value } as Partial<TextBlock>)
                  }
                  className="w-full h-8 p-0 border rounded"
                />

                </div>
              )}

              {selectedBlock?.type === "image" && (
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-sm font-medium">Image Label:</span>
                    <input
                      type="text"
                      value={selectedBlock.label || ""}
                      onChange={e =>
                        updateSelectedBlock({ label: e.target.value } as Partial<ImageBlock>)
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Opacity:</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={selectedBlock.opacity ?? 1}
                      onChange={e =>
                        updateSelectedBlock({ opacity: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </label>
                </div>
              )}

              {selectedBlock && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <button
                      className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() =>
                        updateSelectedBlock({ zIndex: (selectedBlock.zIndex ?? 0) + 1 })
                      }
                    >
                      <MoveUp size="16" />
                    </button>
                    <button
                      className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() =>
                        updateSelectedBlock({ zIndex: Math.max((selectedBlock.zIndex ?? 0) - 1, 0) })
                      }
                    >
                      <MoveDown size="16" />
                    </button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">Layer: {selectedBlock?.zIndex ?? 0}</div>

            </div>
          ) : (
            <><div className="text-gray-500">No block selected</div><div className="space-y-2">
                <label className="block text-sm font-medium">Page Background</label>
                <input
                  type="color"
                  value={layout.pages[currentPageIndex].backgroundColor || "#ffffff"}
                  onChange={(e) => {
                    const newColor = e.target.value
                    const updatedPages = [...layout.pages]
                    updatedPages[currentPageIndex] = {
                      ...updatedPages[currentPageIndex],
                      backgroundColor: newColor,
                    }
                    setLayout({ ...layout, pages: updatedPages })
                  } } />
                <button
                  onClick={() => {
                    const updatedPages = [...layout.pages]
                    delete updatedPages[currentPageIndex].backgroundColor
                    setLayout({ ...layout, pages: updatedPages })
                  } }
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Reset
                </button>
              </div></>
          )}
        </motion.div>
      </div>
    </div>
  );
}