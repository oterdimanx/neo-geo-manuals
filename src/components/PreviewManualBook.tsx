
import { ManualLayout, ManualBlock} from '@/types/ManualLayout'
import React, { useState } from 'react'

type Props = {
    manual: ManualLayout;
};

type ManualPage = {
    id: string
    blocks: ManualBlock[]
    backgroundColor?: string
  };
  
  export const PreviewManualBook: React.FC<Props> = ({ manual }) => {
    const pages = manual.pages || [];
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const isCover = currentIndex === 0;
    const canGoNext = currentIndex + 2 < pages.length;
    const canGoPrev = currentIndex > 0;
  
    const handleNext = () => {
      if (canGoNext) setCurrentIndex(currentIndex + 2);
    };
  
    const handlePrev = () => {
      if (canGoPrev) setCurrentIndex(currentIndex - 2);
    };
  
    const renderBlock = (block: any) => {
      const baseStyle = {
        top: block.y,
        left: block.x,
        width: block.width,
        height: block.height,
        zIndex: block.zIndex || 1,
        position: 'absolute' as const,
      };
  
      if (block.type === 'text') {
        return (
          <div
            key={block.id}
            className="p-1 whitespace-pre-wrap break-words"
            style={{
              ...baseStyle,
              fontSize: block.fontSize,
              fontWeight: block.fontWeight || 'normal',
              fontStyle: block.italic ? 'italic' : 'normal',
              color: block.color || '#000',
              fontFamily: block.fontFamily || 'sans-serif',
              transform: `rotate(${block.rotation || 0}deg)`,
            }}
          >
            {block.content}
          </div>
        );
      }
  
      if (block.type === 'image') {
        return (
          <div
            key={block.id}
            style={{
              ...baseStyle,
              opacity: block.opacity ?? 1,
            }}
          >
            <img
              src={block.src}
              alt={block.altText || ''}
              className="w-full h-full object-contain"
            />
          </div>
        );
      }
  
      return null;
    };
  
    const renderPage = (page: ManualPage | undefined, extraClasses = '') => {
      if (!page) return <div className="w-full h-full bg-gray-100" />;
  
      return (
        <div
          className={`absolute w-full h-full bg-white shadow-inner p-4 transition-transform duration-700 ${extraClasses}`}
          style={{
            backgroundColor: page.backgroundColor || '#fff',
          }}
        >
          {page.blocks.map(renderBlock)}
        </div>
      );
    };
  
    return (
      <div className="flex flex-col items-center justify-center scale-[0.8]">
        <div className="relative flex w-[900px] h-[600px] perspective-[2000px]">
          {isCover ? (
            <div className="relative w-full h-full border border-gray-300 overflow-hidden">
              {renderPage(pages[0])}
            </div>
          ) : (
            <>
              <div className="relative w-1/2 h-full border-r border-gray-300 overflow-hidden">
                {renderPage(pages[currentIndex])}
              </div>
              <div className="relative w-1/2 h-full overflow-hidden">
                {renderPage(pages[currentIndex + 1])}
              </div>
            </>
          )}
        </div>
  
        <div className="mt-4 flex gap-4">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            ◀ Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      </div>
    );
  };