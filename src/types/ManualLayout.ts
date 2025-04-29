export type BlockType = "text" | "image"

export interface ManualBlockBase {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: BlockType
}

export interface TextBlock extends ManualBlockBase {
  type: "text"
  content: string
  fontSize: number
}

export interface ImageBlock extends ManualBlockBase {
  type: "image"
  src: string
}

export type ManualBlock = TextBlock | ImageBlock;

export interface ManualLayout {
  pages: {
    id: string
    blocks: ManualBlock[]
  }[]
}