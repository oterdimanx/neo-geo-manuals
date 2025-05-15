import { supabase } from './supabaseClient'
import { ImageBlock, ManualLayout, TextBlock } from '@/types/ManualLayout'

export async function saveManualWithPages(
  userId: string,
  title: string,
  pages: any[],
  manualId?: string // optional param
) {
  // 1. Upsert the manual
  const { data: manualData, error: manualError } = await supabase
  .from('manuals')
  .upsert(
    [{ id: manualId ?? undefined, user_id: userId, title }],
    { onConflict: 'id'}
    )
  .select()
  .single()

  if (manualError || !manualData ) {
    throw new Error ( `Failed to save Manual: ${manualError?.message}` )
  }

  const newManualId = manualData.id

  // 2. For each page
  for (const page of pages) {
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .upsert([
        {
          id: page.id ?? undefined,
          manual_id: newManualId,
          background_color: page.backgroundColor,
        }
      ],
      { onConflict: 'id' }
      )
      .select()
      .single()

    if (pageError || !pageData ) {
      throw new Error ( `Failed to save Page: ${pageError?.message}` )
    }

    /** Block Suppression handling */
    const currentPageIds = pages.map(page => page.id)
    const currentBlockIds = pages.flatMap(page =>
      page.blocks.map((block: { id: any; }) => block.id)
    )
    // Suppression Step 1: Fetch existing block IDs in DB for current pages
    const { data: existingBlocks, error: fetchError } = await supabase
      .from("blocks")
      .select("id")
      .in("page_id", currentPageIds)

    if (fetchError) {
      console.error("Failed to fetch existing blocks", fetchError)
      return
    }

    const existingBlockIds = existingBlocks.map((b: any) => b.id)

    // Suppression Step 2: Find blocks that exist in DB but no longer in layout
    const blockIdsToDelete = existingBlockIds.filter(
      id => !currentBlockIds.includes(id)
    )

    if (blockIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("blocks")
        .delete()
        .in("id", blockIdsToDelete)

      if (deleteError) {
        console.error("Failed to delete removed blocks", deleteError)
      }
    }

    const newPageId = pageData.id

    // 3. Save blocks for this page
    const blocksToInsert = page.blocks.map((block: TextBlock | ImageBlock, index: any) => {
      const isText = block.type === 'text'
      const isImage = block.type === 'image'

      return {
        id: block.id ?? undefined,
        page_id: newPageId,
        type: block.type,
        block_order: index,

        // Shared
        x: block.x,
        y: block.y,
        width: block.width,
        height: block.height,
        zIndex: block.zIndex,

        // Text-only
        content: isText ? (block as TextBlock).content : null,
        fontSize: isText ? (block as TextBlock).fontSize : null,
        fontFamily: isText ? (block as TextBlock).fontFamily : null,
        fontWeight: isText ? (block as TextBlock).fontWeight : "normal",
        color: isText ? (block as TextBlock).color : null,
        italic: isText ? (block as TextBlock).italic : null,
        rotation: isText ? (block as TextBlock).rotation : null,

        // Image-only
        src: isImage ? (block as ImageBlock).src : null,
        altText: isImage ? (block as ImageBlock).altText : null,
        opacity: isImage ? (block as ImageBlock)?.opacity ?? 1 : null,
        label: isImage ? (block as ImageBlock).label : null,
      }
    })

    const { error: blocksError } = await supabase
      .from('blocks')
      .upsert(blocksToInsert, { onConflict: 'id' })

    if (blocksError) {
      throw new Error(`Failed to save blocks: ${blocksError.message}`)
    }
  }

  //pages suppression handling
// Step 1: Fetch existing page IDs in DB for this manual
const { data: existingPages, error: fetchPagesError } = await supabase
  .from("pages")
  .select("id")
  .eq("manual_id", newManualId) // Use the manual id you just saved/used

if (fetchPagesError) {
  console.error("Failed to fetch existing pages", fetchPagesError)
  return
}

const existingPageIds = existingPages.map((page: any) => page.id)

// Step 2: Get the current layout's page IDs
const currentPageIds = pages.map((page) => page.id)

// Step 3: Identify pages to delete
const pageIdsToDelete = existingPageIds.filter(
  (id) => !currentPageIds.includes(id)
);

// Step 4: Delete removed pages
if (pageIdsToDelete.length > 0) {
  const { error: deletePagesError } = await supabase
    .from("pages")
    .delete()
    .in("id", pageIdsToDelete)

  if (deletePagesError) {
    console.error("Failed to delete removed pages", deletePagesError)
  }
}

  return newManualId
}