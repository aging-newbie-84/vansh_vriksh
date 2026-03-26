import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if credentials exist (graceful fallback to localStorage)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Save a confirmed family tree to Supabase.
 * Returns { id, share_code } for the saved tree.
 */
export async function saveTree(familyName, treeData) {
  if (!supabase) {
    console.warn('Supabase not configured — tree saved to localStorage only.');
    return null;
  }

  const { data, error } = await supabase
    .from('vv_trees')
    .insert({ family_name: familyName, tree_data: treeData })
    .select('id, share_code')
    .single();

  if (error) {
    console.error('Failed to save tree:', error);
    throw error;
  }
  return data;
}

/**
 * Update an existing tree in Supabase.
 */
export async function updateTree(treeId, treeData) {
  if (!supabase) return null;

  const { error } = await supabase
    .from('vv_trees')
    .update({ tree_data: treeData, updated_at: new Date().toISOString() })
    .eq('id', treeId);

  if (error) {
    console.error('Failed to update tree:', error);
    throw error;
  }
  return true;
}

/**
 * Load a tree by share code (for shareable links like /tree/abc12345).
 */
export async function loadTreeByShareCode(shareCode) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('vv_trees')
    .select('*')
    .eq('share_code', shareCode)
    .single();

  if (error) {
    console.error('Failed to load tree:', error);
    return null;
  }
  return data;
}

/**
 * Load a tree by ID.
 */
export async function loadTreeById(treeId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('vv_trees')
    .select('*')
    .eq('id', treeId)
    .single();

  if (error) {
    console.error('Failed to load tree:', error);
    return null;
  }
  return data;
}
