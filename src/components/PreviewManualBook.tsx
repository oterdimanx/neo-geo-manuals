
import { ManualLayout, ManualBlock} from '@/types/ManualLayout'
import React, { useState } from "react"

type PreviewManualBookProps = {
  layout: ManualLayout
};

export const PreviewManualBook: React.FC<PreviewManualBookProps> = ({ layout }) => {

    const [currentSpread, setCurrentSpread] = useState(0)
    const totalSpreads = Math.ceil((layout.pages.length - 1) / 2) // page 1 is cover
  
    const goNext = () => {
      if (currentSpread < totalSpreads) setCurrentSpread((prev) => prev + 1)
    };
  
    const goPrev = () => {
      if (currentSpread > 0) setCurrentSpread((prev) => prev - 1)
    };
  
    const renderBlock = (block: ManualBlock) => {
      if (block.type === 'text') {
        const style = {
          fontSize: `${block.fontSize}px`,
          fontWeight: block.fontWeight || 'normal',
          fontFamily: block.fontFamily || 'sans-serif',
          color: block.color || '#000',
          fontStyle: block.italic ? 'italic' : 'normal',
          transform: `rotate(${block.rotation || 0}deg)`,
        }
        return <div key={block.id} style={style} className="absolute" dangerouslySetInnerHTML={{ __html: block.content }} />
      }
  
      if (block.type === 'image') {
        return (
          <img
            key={block.id}
            src={block.src}
            alt={block.altText || ''}
            className="absolute"
            style={{ opacity: block.opacity ?? 1 }}
          />
        )
      }
  
      return null
    }
  
    const renderPage = (pageIndex: number) => {
      const page = layout.pages[pageIndex]
      if (!page) return null
  
      return (
        <div
          key={page.id}
          className="relative w-[300px] h-[300px] bg-white shadow-md overflow-hidden border border-gray-300"
          style={{ backgroundColor: page.backgroundColor }}
        >
          {page.blocks.map(renderBlock)}
        </div>
      )
    }
  
    return (
      <div className="flex flex-col items-center">
        <div className="relative flex gap-4 items-center justify-center p-4">
          {currentSpread === 0 ? (
            // Cover page
            renderPage(0)
          ) : (
            <>
              {renderPage(currentSpread * 2 - 1)}
              {renderPage(currentSpread * 2)}
            </>
          )}
        </div>
  
        <div className="flex gap-4 mt-4">
          <button onClick={goPrev} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50" disabled={currentSpread === 0}>
            Previous
          </button>
          <button onClick={goNext} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 disabled:opacity-50" disabled={currentSpread >= totalSpreads}>
            Next
          </button>
        </div>
      </div>
    )
  }
  