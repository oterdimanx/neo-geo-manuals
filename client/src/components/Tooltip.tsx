import { useState } from "react"

export default function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full mb-1 w-max max-w-xs text-sm bg-black text-white px-2 py-1 rounded shadow-lg z-50">
          {text}
        </div>
      )}
    </div>
  );
}