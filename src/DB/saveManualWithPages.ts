import { supabase } from './supabaseClient';
import { ManualLayout } from '@/types/ManualLayout';

export async function saveManualWithPages(userId: string, manual: ManualLayout) {
  // 1. Upsert the manual
  const { data: manualData, error: manualError } = await supabase
    .from('manuals')
    .upsert([
      {
        id: manual.id,
        user_id: userId,
        title: manual.title || 'Manual Title Placeholder'
      }
    ])
    .select()
    .single();

  if (manualError) throw manualError;

  // 2. For each page
  for (const [index, page] of manual.pages.entries()) {
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .upsert([
        {
          id: page.id,
          manual_id: manualData.id,
          background_color: page.backgroundColor,
          page_order: index
        }
      ])
      .select()
      .single();

    if (pageError) throw pageError;

    // 3. Save blocks for this page
    for (const [blockIndex, block] of page.blocks.entries()) {
      const { error: blockError } = await supabase.from('blocks').upsert([
        {
          id: block.id,
          page_id: pageData.id,
          type: block.type,
          block_order: blockIndex,
          x: block.x,
          y: block.y,
          width: block.width,
          height: block.height,
          content: (block.content) || {},
          zIndex: block.zIndex,
          fontFamily: block.fontFamily,
          fontWeight: block.fontWeight,
          fontSize: block.fontSize,
          color: block.color,
          italic: block.italic,
          rotation: block.rotation,
/*
          
          image_provider: block.imageProvider || null,
          src: block.src || null,
          prompt: block.prompt || null,
          
          
          

*/
        }
      ]);
      if (blockError) throw blockError;
    }
  }

  return manualData.id;
}