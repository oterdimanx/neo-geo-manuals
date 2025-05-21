import { FC } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ManualBlock, ImageBlock, TextBlock, ManualLayout } from "@/types/ManualLayout"
import { cn } from "../utils/utils"
import { GripVertical } from "lucide-react"

interface Page {
  id: string;
  backgroundColor: string
  blocks: ManualBlock[];
}

interface Props {
  page: ManualLayout["pages"][number]
  index: number
  currentPageIndex: number
  onSelect: () => void
  onClone: () => void
}

export const SortablePageThumbnail: FC<Props> = ({
  page,
  index,
  currentPageIndex,
  onSelect,
  onClone,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={onSelect}
        className={cn(
          "cursor-pointer border bg-white rounded shadow-sm p-1 relative",
          index === currentPageIndex ? "border-blue-500" : "border-gray-400"
        )}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1 right-1 w-4 h-4 bg-gray-400 rounded cursor-move"
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </div>
        <div 
          className="cursor-pointer"
        >
          <div className="text-xs text-center mb-1">Page {index + 1}</div>
          <div className="relative w-full h-20 overflow-hidden border border-gray-300">
          {/* Background layer */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: page.backgroundColor || "#fff", zIndex: 0 }}
          />
          {/* Blocks */}
          {page.blocks.map((block) => (
            <div
              key={block.id}
              className="absolute"
              style={{
                zIndex: 1, // ensures it's above the background
                left: `${(block.x / 800) * 100}%`,
                top: `${(block.y / 600) * 100}%`,
                width: `${(block.width / 800) * 100}%`,
                height: `${(block.height / 600) * 100}%`,
                backgroundColor: block.type === "text" ? "#ccc" : "transparent",
                border: "1px solid #999",
                fontSize: "6px",
                overflow: "hidden",
              }}
            >
              {block.type === "text" ? (
                <span>{(block as TextBlock).content.slice(0, 10)}</span>
              ) : (
                <img
                  src={(block as ImageBlock).src}
                  className="w-full h-full object-cover"
                  alt=""
                />
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClone()
        }}
        className="mt-1 w-full text-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded px-1 py-0.5"
      >
        Clone
      </button>
    </div>
  )
}