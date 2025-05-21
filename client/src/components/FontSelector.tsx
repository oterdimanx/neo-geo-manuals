import { useState } from "react";

export default function FontSelector({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  const availableFonts = [
    { label: "Default", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Mono", value: "monospace" },
    { label: "Pixel (Press Start 2P)", value: "'Press Start 2P', cursive" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Arial", value: "Arial" },
    { label: "Georgia", value: "Georgia" },
    { label: "Courier New", value: "Courier New" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
  ];

  const selectedFont = availableFonts.find((f) => f.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-2 border rounded bg-white"
        style={{ fontFamily: selectedFont?.value }}
      >
        {selectedFont?.label}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow">
          {availableFonts.map((font) => (
            <div
              key={font.value}
              onClick={() => {
                onChange(font.value);
                setOpen(false);
              }}
              className="cursor-pointer hover:bg-gray-100 p-2"
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}