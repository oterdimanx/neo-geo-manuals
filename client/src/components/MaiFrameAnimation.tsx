import React, { useEffect, useState } from 'react';

const MaiFrameAnimation = () => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 15;

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 100); // 100ms per frame → ~10fps

    return () => clearInterval(interval);
  }, []);

  const paddedFrame = String(frame).padStart(2, '0');
  const src = `/frames/mai-frame_${paddedFrame}.png`;

  return (
    <div className="w-64 h-64 overflow-hidden flex justify-center items-center">
      <img
        src={src}
        alt={`Frame ${frame}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MaiFrameAnimation;