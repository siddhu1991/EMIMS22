// Database
import { supabase } from '../utils/supabaseClient';

export async function deleteSection(id) {
  return await supabase.from('ems_sections').delete().eq('id', id);
}

export async function addSection(rowData) {
  return await supabase.from('ems_sections').insert([{ name: rowData.name.value }]);
}

export async function updateSection(id, rowData, updatedAt) {

  return await supabase
    .from('ems_sections')
    .update([{ name: rowData.name.value, updated_at: updatedAt }])
    .eq('id', id);
}