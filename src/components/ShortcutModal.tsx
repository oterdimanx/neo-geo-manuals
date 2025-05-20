import MaiFrameAnimation from "./MaiFrameAnimation"

export default function ShortcutModal({ onClose }: { onClose: () => void }) {
    const shortcuts = [
      { key: "⌘ + S", action: "Save current manual" },
      { key: "⌘ + t", action: "Add Text Block" },
      { key: "⌘ + i", action: "Add Image Block" },
      { key: "⌘ + Z", action: "Undo last change" },
      { key: "⌘ + ⇧ + Z", action: "Redo last undone change" },
      { key: "⌘ + /", action: "Toggle Shortcuts" },
      { key: "← / →", action: "Navigate Pages" },
      { key: "⌘ + ⌫", action: "Remove current page" },
        /** verification check needed */
      { key: '⌘ + Shift + C', action: 'Clear current page content' },
      { key: '⌘ + U', action: 'Upload an image' },
      { key: '⌘ + N', action: 'Add a new page' },
      { key: '⌘ + L', action: 'Load layout from file' },
      { key: '⌘ + Shift + S', action: 'Save manual to database' },
      { key: '⌘ + = / +', action: 'Zoom in' },
      { key: '⌘ + -', action: 'Zoom out' },
      { key: '⌘ + E', action: 'Toggle fullscreen for image block' },
      { key: "Esc", action: "Exit Modes / Close Menus" },
    ]

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
          
          <h2 className="text-xl font-semibold mb-4 relative top-[138px] left-[100px] items-center justify-center">Keyboard Shortcuts</h2>
          <MaiFrameAnimation />
          <ul className="space-y-3">
            {shortcuts.map((s, i) => (
              <li key={i} className="flex justify-between border-b pb-1 text-sm">
                <span className="text-gray-600">{s.action}</span>
                <span className="font-mono text-gray-900">{s.key}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="fixed top-5 text-gray-500 hover:text-black transition flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }