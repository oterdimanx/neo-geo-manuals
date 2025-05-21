import { useEffect, useState } from "react"

interface Props {
    title: string
    onSave: (newTitle: string) => void
  }

export default function EditableTitle({ title, onSave }: Props) {
const [editing, setEditing] = useState(false)
const [value, setValue] = useState(title || "Untitled Manual")

useEffect(()=>{
    setValue(title||'Untitled Manual')
}, [title])

return editing ? (
    <input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={(e) => {
        const trimmedValue = e.target.value.trim()

        // Avoid saving if the title hasn't changed
        if (trimmedValue === title.trim()) {
          setEditing(false)
          return
        }

        setEditing(false)
        onSave(trimmedValue)
    }}
    onKeyDown={(e) => {
        if (e.key === "Enter") {
            const trimmedValue = value.trim()

            // Avoid saving if the title hasn't changed
            if (trimmedValue === title.trim()) {
                setEditing(false)
                return
            }

            setEditing(false)
            onSave(trimmedValue)
        }
    }}
    autoFocus
    className="relative w-[150px] text-xl font-bold top-[5px] items-center justify-center font-bold border rounded"
    />
) : (
    <h1
    className="relative w-[300px] text-xl top-[5px] items-center justify-center font-bold cursor-pointer"
    onClick={() => setEditing(true)}
    >
    {value}
    </h1>
)
}