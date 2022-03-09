// Database
import { supabase } from '../utils/supabaseClient';

export async function deleteCE(id) {
  return await supabase.from('ems_clinical_effectiveness').delete().eq('id', id);
}

export async function addCE(rowData) {
  return await supabase.from('ems_clinical_effectiveness').insert([{ name: rowData.name.value }]);
}

export async function updateCE(id, rowData, updatedAt) {
  return await supabase
    .from('ems_clinical_effectiveness')
    .update([{ name: rowData.name.value, updated_at: updatedAt }])
    .eq('id', id);
}