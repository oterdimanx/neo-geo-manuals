import React, { useState } from 'react';
import { ManualLayout } from '@/types/ManualLayout'

type Page = {
  id: string;
  content: string;
};

type Manual = {
  title: string;
  pages: Page[];
};

type Props = {
  manual: ManualLayout;
};

export const PreviewManualBook: React.FC<Props> = ({ manual }) => {
  const [flippedPages, setFlippedPages] = useState<number[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalPages = manual.pages.length;

  const handleFlip = (index: number) => {
    setFlippedPages((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const nextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-[600px] h-[600px] perspective-[2000px] mx-auto mt-10">
      <div className="absolute z-10 top-2 left-2 text-white text-2xl font-bold bg-black/60 px-4 py-1 rounded">
        {manual.title}
      </div>
      {manual.pages.map((page, i) => {
        const isFlipped = flippedPages.includes(i);

        return (
          <div
            key={page.id}
            className={`absolute w-full h-full transition-transform duration-700 origin-left shadow-xl bg-white border border-gray-300 rounded overflow-hidden cursor-pointer ${
              isFlipped ? 'rotate-y-180 z-0' : `z-[${100 - i}]`
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped
                ? `rotateY(-180deg) translateX(-${i * 2}px)`
                : `translateX(-${i * 2}px)`,
            }}
            onClick={() => handleFlip(i)}
          >
            <div className="p-6 h-full overflow-auto">
              {/*<h2 className="text-xl font-semibold mb-2">Page {i + 1}</h2>*/}
              

              {manual.pages.map((page, i) => {
            const isVisible = i === currentPageIndex;
            const isFlipped = flippedPages.includes(i);
            return (
              <div
                key={page.id}
                className={`absolute w-[500px] h-[500px] transition-all duration-700 ease-in-out rounded border overflow-hidden`}
                style={{
                  backgroundColor: page.backgroundColor || '#fff',
                  transform: `translateX(${isVisible ? 0 : 9999}px)`,
                  zIndex: isVisible ? 10 : 0,
                }}
                onClick={() => handleFlip(i)}
              >
                {page.blocks.map((block) => {
                  const style = {
                    position: 'absolute' as const,
                    top: `${block.y}px`,
                    left: `${block.x}px`,
                    width: `${block.width}px`,
                    height: `${block.height}px`,
                    zIndex: block.zIndex,
                  };
  
                  if (block.type === 'text') {
                    return (
                      <div
                        key={block.id}
                        style={{
                          ...style,
                          fontSize: `${block.fontSize}px`,
                          fontFamily: block.fontFamily || 'sans-serif',
                          fontWeight: block.fontWeight || 'normal',
                          fontStyle: block.italic ? 'italic' : 'normal',
                          color: block.color || '#000',
                          transform: block.rotation
                          ? `rotate(${block.rotation}deg)`
                          : undefined,
                        }}
                        className="p-1 whitespace-pre-wrap"
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
                          ...style,
                          opacity: block.opacity ?? 1,
                        }}
                      >
                        <img
                          src={block.src}
                          alt={block.altText || ''}
                          className="w-full h-full object-contain rounded"
                        />
                        {block.label && (
                          <div className="absolute bottom-0 left-0 text-xs bg-black text-white bg-opacity-70 px-1 py-0.5 rounded-t">
                            {block.label}
                          </div>
                        )}
                      </div>
                    );
                  }
  
                  return null;
                })}


              </div>
            );
          })}

            </div>
          </div>
        );
      })}

    </div>
  );
};