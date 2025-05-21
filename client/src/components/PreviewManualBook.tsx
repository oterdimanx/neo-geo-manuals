import { ManualBlock, ManualLayout } from '@/types/ManualLayout';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from 'react';

export const PreviewManualBook = ({ layout }: { layout: ManualLayout }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const animationRef = useRef<HTMLDivElement>(null);
  const totalPages = layout.pages.length;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    if ((dir === 'next' && isLastPage) || (dir === 'prev' && isFirstPage)) return;

    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(dir === 'next' ? currentPage + 1 : currentPage - 1);
      setIsAnimating(false);
    }, 800);
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
            className="w-full h-full object-cover"
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

      <div className="relative w-full h-full flex justify-center perspective-1200">
        {/* Static book cover */}
        <div className="absolute w-full h-full bg-gray-100 rounded-lg shadow-xl"></div>

        {/* Left Page (when not on first page) */}
        {!isFirstPage && (
          <div 
            className={`absolute left-0 w-1/2 h-full origin-right z-10 ${isAnimating ? 'pointer-events-none' : 'cursor-pointer'}`}
            style={{
              backgroundColor: layout.pages[currentPage - 1]?.backgroundColor || "#fff",
            }}
            onClick={() => !isAnimating && navigate('prev')}
          >
            {layout.pages[currentPage - 1]?.blocks.map(renderBlock)}
          </div>
        )}

        {/* Current Page (right side) */}
        <div 
          className={`absolute right-0 w-1/2 h-full origin-left z-20 ${isLastPage || isAnimating ? 'pointer-events-none' : 'cursor-pointer'}`}
          style={{
            backgroundColor: layout.pages[currentPage]?.backgroundColor || "#fff",
          }}
          onClick={() => !isAnimating && !isLastPage && navigate('next')}
        >
          {layout.pages[currentPage]?.blocks.map(renderBlock)}
        </div>

        {/* Next Page (when not on last page) */}
        {!isLastPage && (
          <div 
            className={`absolute right-0 w-1/2 h-full origin-left z-10 ${isAnimating ? 'pointer-events-none' : 'cursor-pointer'}`}
            style={{
              backgroundColor: layout.pages[currentPage + 1]?.backgroundColor || "#fff",
            }}
            onClick={() => !isAnimating && navigate('next')}
          >
            {layout.pages[currentPage + 1]?.blocks.map(renderBlock)}
          </div>
        )}

        {/* Page Turn Animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              ref={animationRef}
              key={`page-turn-${currentPage}-${direction}`}
              className={`absolute ${direction === 'next' ? 'right-0' : 'left-0'} w-1/2 h-full z-30`}
              style={{
                transformOrigin: direction === 'next' ? 'left center' : 'right center',
                backfaceVisibility: 'hidden',
              }}
              initial={{ 
                rotateY: 0,
                boxShadow: direction === 'next' 
                  ? '20px 0px 30px -10px rgba(0,0,0,0.3)' 
                  : '-20px 0px 30px -10px rgba(0,0,0,0.3)'
              }}
              animate={{ 
                rotateY: direction === 'next' ? -170 : 170,
                boxShadow: direction === 'next' 
                  ? '40px 0px 50px -5px rgba(0,0,0,0.4)' 
                  : '-40px 0px 50px -5px rgba(0,0,0,0.4)'
              }}
              exit={{ rotateY: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              {/* Front of turning page */}
              <div className="absolute w-full h-full" style={{
                backgroundColor: direction === 'next' 
                  ? layout.pages[currentPage]?.backgroundColor || "#fff"
                  : layout.pages[currentPage - (direction === 'prev' ? 1 : 0)]?.backgroundColor || "#fff",
              }}>
                {direction === 'next' 
                  ? layout.pages[currentPage]?.blocks.map(renderBlock)
                  : layout.pages[currentPage - 1]?.blocks.map(renderBlock)}
              </div>
              
              {/* Back of turning page */}
              <div className="absolute w-full h-full" style={{
                backgroundColor: direction === 'next' 
                  ? layout.pages[currentPage + 1]?.backgroundColor || "#fff"
                  : layout.pages[currentPage]?.backgroundColor || "#fff",
                transform: 'rotateY(180deg)',
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