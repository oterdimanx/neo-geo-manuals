import { supabase } from './supabaseClient'
import { ManualLayout, TextBlock, ImageBlock } from '@/types/ManualLayout'

export async function fetchLatestManualForUser(userId: string): Promise<ManualLayout | null> {
  const { data, error } = await supabase
    .from('manuals')
    .select(`
      id,
      title,
      pages (
        id,
        background_color,
        blocks (
          id,
          type,
          content,
          x,
          y,
          width,
          height,
          zIndex,
          fontFamily,
          fontSize,
          fontWeight,
          color,
          italic,
          rotation,
          src,
          altText,
          opacity
        )
      )
    `)
    .eq('user_id', userId)
    .limit(1)

  if (error || !data || data.length === 0) {
    console.error('Failed to fetch manual:', error)
    return null
  }

  const manual = data[0]

  const layout: ManualLayout = {
    id: manual.id,
    title: manual.title,
    pages: manual.pages.map((page: any) => ({
      id: page.id,
      backgroundColor: page.background_color,
      blocks: page.blocks.map((block: any) => {
        if (block.type === 'text') {
          const textBlock: TextBlock = {
            id: block.id,
            type: 'text',
            content: block.content,
            x: block.x,
            y: block.y,
            width: block.width,
            height: block.height,
            zIndex: block.zIndex,
            fontFamily: block.fontFamily,
            fontSize: block.fontSize,
            color: block.color,
            italic: block.italic,
            fontWeight: block.fontWeight,
            rotation: block.rotation,
            order: block.block_order
          }
          return textBlock
        } else if (block.type === 'image') {
          const imageBlock: ImageBlock = {
            id: block.id,
            type: 'image',
            x: block.x,
            y: block.y,
            width: block.width,
            height: block.height,
            zIndex: block.zIndex,
            src: block.src,
            altText: block.altText,
            opacity: block.opacity,
            label: block.label,
            order: block.block_order
          }
          return imageBlock
        } else {
          console.warn('Unknown block type:', block.type)
          return null
        }
      }).filter((b: TextBlock | ImageBlock | null): b is TextBlock | ImageBlock => b !== null),
    })),
  }

  return layout
}