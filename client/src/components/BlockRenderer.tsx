import React from 'react';
import type { ManualBlock } from '@/types/ManualLayout'
/** This component is not used yet */
type Props = {
  block: ManualBlock;
};

const BlockRenderer: React.FC<Props> = ({ block }) => {
  const style = {
    /*position: 'absolute',*/
    left: `${block.x}%`,
    top: `${block.y}%`,
    width: `${block.width}%`,
    height: `${block.height}%`,
    zIndex: block.zIndex,
    
  };

  if (block.type === 'text') {
    return (
      <div
        style={{
          ...style,
          fontSize: block.fontSize,
          fontFamily: block.fontFamily,
          fontWeight: block.fontWeight,
          color: block.color,
          fontStyle: block.italic ? 'italic' : 'normal',
          transform: block.rotation ? `rotate(${block.rotation}deg)` : undefined,
        }}
        className="overflow-hidden"
      >
        {(block as any).content}
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <img
        src={(block as any).src}
        alt={(block as any).altText || ''}
        style={{ ...style, opacity: (block as any).opacity ?? 1 }}
        className="object-cover"
      />
    );
  }

  return null;
};

export default BlockRenderer;
