import { ManualBlock, ManualLayout } from '@/types/ManualLayout';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

interface BookletProps {
  layout: ManualLayout;
}

export const PreviewManualBook = ({ layout }: BookletProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const totalPages = layout.pages.length;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    
    setDirection(dir);
    setIsAnimating(true);
    
    if (dir === 'next' && !isLastPage) {
      setCurrentPage(currentPage + 1);
    } else if (dir === 'prev' && !isFirstPage) {
      setCurrentPage(currentPage - 1);
    }
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const renderBlock = (block: ManualBlock) => {

    return (
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
          <span>{(block).content.slice(0, 10)}</span>
        ) : (
          <img
            src={(block).src}
            className="w-[45%] h-[45%] object-cover"
            alt=""
          />
        )}
      </div>
    );
  };

  return (
    <div className="relative w-[800px] h-[600px] mx-auto">
      {layout.title && (
        <h1 className="text-3xl font-bold text-center mb-6">{layout.title}</h1>
      )}

      <div className="relative w-full h-full flex justify-center perspective-1000">
        {/* Static background */}
        <div className="absolute w-full h-full bg-gray-100 rounded-lg shadow-lg"></div>

        {/* Current Page (left side when in spread) */}
        {!isFirstPage && (
          <div 
            className="absolute inset-0 left-0 w-1/2 h-full bg-white origin-right z-10 cursor-pointer"
            style={{
              backgroundColor: layout.pages[currentPage - 1]?.backgroundColor || "#fff",
            }}
            onClick={() => navigate('prev')}
          >
            {layout.pages[currentPage - 1]?.blocks.map(renderBlock)}
          </div>
        )}

        {/* Current Page (right side) */}
        <div 
          className="absolute right-0 w-1/2 h-full bg-white origin-left z-20 cursor-pointer"
          style={{
            backgroundColor: layout.pages[currentPage]?.backgroundColor || "#fff",
          }}
          onClick={() => navigate('next')}
        >
          {layout.pages[currentPage]?.blocks.map(renderBlock)}
        </div>

        {/* Next Page (right side when in spread) */}
        {!isLastPage && (
          <div 
            className="absolute right-0 w-1/2 h-full bg-white origin-left z-10 cursor-pointer"
            style={{
              backgroundColor: layout.pages[currentPage + 1]?.backgroundColor || "#fff",
            }}
            onClick={() => navigate('next')}
          >
            {layout.pages[currentPage + 1]?.blocks.map(renderBlock)}
          </div>
        )}

        {/* Page Turn Animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              key={`page-turn-${currentPage}`}
              className={`absolute ${direction === 'next' ? 'right-0' : 'left-0'} w-1/2 h-full z-30`}
              style={{
                transformOrigin: direction === 'next' ? 'left center' : 'right center',
                backfaceVisibility: 'hidden',
              }}
              initial={{ 
                rotateY: 0,
                background: direction === 'next' 
                  ? layout.pages[currentPage]?.backgroundColor || "#fff"
                  : layout.pages[currentPage - 1]?.backgroundColor || "#fff"
              }}
              animate={{ 
                rotateY: direction === 'next' ? -180 : 180,
              }}
              exit={{ rotateY: 0 }}
              transition={{ 
                duration: 1,
                ease: [0.16, 1, 0.3, 1] // Custom easing for natural movement
              }}
            >
              {/* Front of turning page */}
              <div className="absolute w-full h-full" style={{
                backgroundColor: direction === 'next' 
                  ? layout.pages[currentPage]?.backgroundColor || "#fff"
                  : layout.pages[currentPage - 1]?.backgroundColor || "#fff",
                backfaceVisibility: 'hidden',
              }}>
                {direction === 'next' 
                  ? layout.pages[currentPage]?.blocks.map(renderBlock)
                  : layout.pages[currentPage - 1]?.blocks.map(renderBlock)}
              </div>
              
              {/* Back of turning page (visible during turn) */}
              <div className="absolute w-full h-full" style={{
                backgroundColor: direction === 'next' 
                  ? layout.pages[currentPage + 1]?.backgroundColor || "#fff"
                  : layout.pages[currentPage]?.backgroundColor || "#fff",
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}>
                {direction === 'next' 
                  ? layout.pages[currentPage + 1]?.blocks.map(renderBlock)
                  : layout.pages[currentPage]?.blocks.map(renderBlock)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('prev')}
          disabled={isFirstPage}
          className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="self-center">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => navigate('next')}
          disabled={isLastPage}
          className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};