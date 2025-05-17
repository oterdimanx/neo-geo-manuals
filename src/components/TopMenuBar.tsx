import {
    Save, Undo, Redo, Plus, ImagePlus, Upload,
    ChevronLeft, ChevronRight, FilePlus, FileMinus,
    UploadCloud, Download, ZoomIn, ZoomOut,
    LogOut, Trash2, Check
  } from "lucide-react"
  import Tooltip from "./Tooltip"
  import { useState } from "react"
  
  type Props = {
    onUndo: () => void
    onRedo: () => void
    onAddTextBlock: () => void
    onAddImageBlock: () => void
    onOpenUploadWidget: () => void
    onPrevPage: () => void
    onNextPage: () => void
    onAddPage: () => void
    onRemovePage: () => void
    onZoomIn: () => void
    onZoomOut: () => void
    onLoadLayout: () => void
    onSaveToDB: () => void
    onSave: () => void
    onLogout: () => void
  };

  type IconButtonProps = {
    icon: React.ReactNode
    label: string
    onClick: () => void
  }

  export default function TopMenuBar(props: Props) {
    const [saveSuccess, setSaveSuccess] = useState(false)

    const undo = () => {
        props.onUndo()
    };

    const redo = () => {
        props.onRedo()
    };
    
    const AddTextBlock = () => {
        props.onAddTextBlock()
    };

    const AddImageBlock = () => {
        props.onAddImageBlock()
    };

    const openUploadWidget = () => {
        props.onOpenUploadWidget()
    };
  
    const prevPage = () => {
        props.onPrevPage()
    };
  
    const nextPage = () => {
        props.onNextPage()
    };
    
    const addPage = () => {
        props.onAddPage()
    };
  
    const removePage = () => {
        props.onRemovePage()
    };
    
    const zoomIn = () => {
        props.onZoomIn()
    };
  
    const zoomOut = () => {
        props.onZoomOut()
    };
    
    const loadLayout = () => {
        props.onLoadLayout()
    };
  
    const saveToDB = () => {
        props.onSaveToDB()
    };
      
    const save = () => {
        props.onSave()
    };
  
    const logout = () => {
        props.onLogout()
    };
    
    return (
        <Tooltip text={""} >
            <div className="flex flex-wrap gap-2 p-2 bg-white border-b shadow-sm sticky top-0 z-50">
            
            <Group label="Block">
            <IconButton icon={<Plus />} label="Add Text" onClick={props.onAddTextBlock} />
            <IconButton icon={<ImagePlus />} label="Add Image" onClick={props.onAddImageBlock} />
            <IconButton icon={<Upload />} label="Upload Image" onClick={props.onOpenUploadWidget} />
            </Group>

            {/* Page actions */}
            <Group label="Page">
            <IconButton icon={<ChevronLeft />} label="Previous" onClick={props.onPrevPage} />
            <IconButton icon={<ChevronRight />} label="Next" onClick={props.onNextPage} />
            <IconButton icon={<FilePlus />} label="Add Page" onClick={props.onAddPage} />
            <IconButton icon={<FileMinus />} label="Remove Page" onClick={props.onRemovePage} />
            </Group>

            {/* Layout */}
            <Group label="Layout">
            <IconButton icon={<UploadCloud />} label="Load Layout" onClick={props.onLoadLayout} />
            <IconButton icon={<Download />} label="Save to DB" onClick={props.onSaveToDB} />
            </Group>

            {/* Zoom & edit */}
            <Group label="View">
            <IconButton icon={<ZoomIn />} label="Zoom In" onClick={props.onZoomIn} />
            <IconButton icon={<ZoomOut />} label="Zoom Out" onClick={props.onZoomOut} />
            </Group>

            {/* Undo/Redo/Save */}
            <Group label="History">
                <IconButton icon={<Undo />} label="Undo" onClick={props.onUndo} />
                <IconButton icon={<Redo />} label="Redo" onClick={props.onRedo} />
            </Group>

            {/* Save & Logout */}
            <Group label="Session">
            <IconButton icon={saveSuccess ? <Check className="text-green-500" /> : <Save />} label="Save" onClick={props.onSave} />
            <IconButton icon={<LogOut />} label="Log Out" onClick={props.onLogout} />
            </Group>
        </div>
      </Tooltip>
    );
  }
  
  function IconButton({ icon, label, onClick }: IconButtonProps) {
    return (
      <Tooltip text={label}>
          <button
            onClick={onClick}
            className="p-2 rounded hover:bg-muted active:scale-95 transition"
            aria-label={label}
          >
            {icon}
          </button>
      </Tooltip>
    );
  }
  
  function Group({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center gap-1 border-r pr-2">
        {children}
      </div>
    );
  }