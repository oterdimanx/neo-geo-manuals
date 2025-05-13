export type BlockType = "text" | "image"

export interface ManualBlockBase {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: BlockType
  zIndex?: number
}

export interface TextBlock extends ManualBlockBase {
  type: "text"
  content: string
  fontSize: number
  fontFamily?: string
  fontWeight?: "normal" | "bold"
  color?: string
  italic?: boolean
  rotation?: number
}

export interface ImageBlock extends ManualBlockBase {
  type: "image"
  src: string
  altText?: string
  opacity?: number
  label?: string
}

export type ManualBlock = TextBlock | ImageBlock;

export interface ManualLayout {
  id: string
  title?: string
  pages: {
    id: string
    blocks: ManualBlock[]
    backgroundColor?: string
  }[]
}

export interface ManualTemplate {
  name: string
  blocks: ManualBlock[]
}