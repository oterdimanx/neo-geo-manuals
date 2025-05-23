import { ManualBlock, ManualLayout } from '@/types/ManualLayout';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from 'react';

export const PreviewManualBook = ({ layout }: { layout: ManualLayout }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handleNextPage = () => {
    setDirection(1);
    if (currentPageIndex < layout.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setDirection(-1);
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const currentPage = layout.pages[currentPageIndex];
  const squareSize = Math.min(500, 500);

  // Animation configurations
  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.5
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'tween', duration: 0.3 }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0.5,
      transition: { type: 'tween', duration: 0.3 }
    })
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div 
        className="relative overflow-hidden shadow-lg"
        style={{
          width: squareSize,
          height: squareSize,
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPageIndex}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full flex flex-col justify-center items-center p-4"
            style={{ 
              backgroundColor: currentPage.backgroundColor }}
          >
            {currentPage.blocks.map((block: any, index: number) => (
              <div key={index} className="w-full my-1 relative">
                {block.type === 'text' ? (
                  <div 
                  style={{ 
                    backgroundColor: block.type === "text" ? "#ccc" : "transparent",
                    border: "1px solid #999",
                    fontSize: block.fontSize,
                    fontFamily: block.fontFamily,
                    overflow: "hidden",
                    zIndex: 1,
                    left: `${block.x}px`,
                    top: `${block.y}px`,
                   }}

                  className="text-center break-words">
                    {block.content}
                    </div>
                ) : (
                  <img 
                    src={block.src} 
                    alt={`Page ${currentPageIndex + 1} Image ${index + 1}`}
                    className="max-w-full mx-auto"
                    style={{ maxHeight: squareSize * 0.6 }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Unchanged navigation */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPageIndex + 1} of {layout.pages.length}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPageIndex === layout.pages.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
