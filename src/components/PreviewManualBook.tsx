import { ManualBlock, ManualLayout } from '@/types/ManualLayout';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

interface BookletProps {
  layout: ManualLayout;
}

export const PreviewManualBook = ({ layout }: BookletProps) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate left/right pages for the current spread
  const leftPage = currentSpread;
  const rightPage = currentSpread + 1;

  const nextSpread = () => {
    if (rightPage < layout.pages.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSpread(currentSpread + 1);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  const prevSpread = () => {
    if (leftPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSpread(currentSpread - 1);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  // Render a single block (text/image)
  const renderBlock = (block: ManualBlock) => {
    const style = {
      position: "absolute" as const,
      left: `${block.x}px`,
      top: `${block.y}px`,
      width: `${block.width/2}px`,
      height: `${block.height/2}px`,
      zIndex: block.zIndex || 1,
    };

    return (
      <div key={block.id} style={style}>
        {block.type === "text" ? (
          <p
            style={{
              fontSize: `${block.fontSize}px`,
              fontWeight: block.fontWeight,
              color: block.color || "black",
              fontFamily: block.fontFamily,
              fontStyle: block.italic ? 'italic' : 'normal',
              transform: `rotate(${block.rotation || 0}deg)`,
              width: '100%',
              height: '100%',
              margin: 0
            }}
          >
            {block.content}
          </p>
        ) : (
          <img
            src={block.src}
            alt={block.altText || ''}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: block.opacity ?? 1
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full mx-auto">
      {/* Title */}
      {layout.title && (
        <h1 className="text-3xl font-bold text-center mb-6">{layout.title}</h1>
      )}

      {/* Book Container */}
      <div className="relative w-[800px] h-[600px] flex justify-center perspective-2000">
        {/* Static background for all pages */}
        <div className="absolute w-full h-[75%] bg-gray-100 rounded-lg shadow-lg"></div>

        {/* Left Page Stack (hidden behind cover when not active) */}
        <AnimatePresence>
          {leftPage > 0 && (
            <motion.div
              key={`left-${leftPage}`}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 0 }}
              className={`absolute left-0 w-1/3 h-1/3 bg-white origin-right ${leftPage === currentSpread ? 'z-20' : 'z-10'}`}
              style={{
                backgroundColor: layout.pages[leftPage]?.backgroundColor || "#fff",
              }}
            >
              {layout.pages[leftPage]?.blocks.map(renderBlock)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cover Page (always visible first) */}
        <AnimatePresence>
          {currentSpread === 0 && (
            <motion.div
              key="cover"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isAnimating ? -180 : 0 }}
              transition={{ duration: 0.8 }}
              className="absolute right-0 w-1/3 h-1/3 bg-white origin-left z-30"
              style={{
                backgroundColor: layout.pages[0]?.backgroundColor || "#fff",
              }}
            >
              {layout.pages[0]?.blocks.map(renderBlock)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Pages */}
        <AnimatePresence>
          {rightPage < layout.pages.length && currentSpread > 0 && (
            <motion.div
              key={`right-${rightPage}`}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 0 }}
              className="absolute right-0 w-1/3 h-1/3 bg-white origin-left z-10"
              style={{
                backgroundColor: layout.pages[rightPage]?.backgroundColor || "#fff",
              }}
            >
              {layout.pages[rightPage]?.blocks.map(renderBlock)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Right Page (when flipping) */}
        {currentSpread > 0 && (
          <motion.div
            key={`active-right-${rightPage}`}
            initial={{ rotateY: 30 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute right-0 w-1/3 h-1/3 bg-white origin-left z-20"
            style={{
              backgroundColor: layout.pages[rightPage]?.backgroundColor || "#fff",
            }}
          >
            {layout.pages[rightPage]?.blocks.map(renderBlock)}
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevSpread}
          disabled={leftPage <= 0}
          className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="self-center">
          {Math.ceil(currentSpread / 2) + 1} / {Math.ceil(layout.pages.length / 2)}
        </span>
        <button
          onClick={nextSpread}
          disabled={rightPage >= layout.pages.length - 1}
          className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};