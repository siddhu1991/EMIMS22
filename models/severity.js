// Database
import { supabase } from '../utils/supabaseClient';

export async function deleteSeverity(id) {
  return await supabase.from('ems_severity').delete().eq('id', id);
}

export async function addSeverity(rowData) {
  return await supabase.from('ems_severity').insert([{ name: rowData.name.value, alert: rowData.alert.value, review: rowData.review.value }]);
}

export async function updateSeverity(id, rowData, updatedAt) {

  return await supabase
    .from('ems_severity')
    .update([{ name: rowData.name.value,alert: rowData.alert.value, review: rowData.review.value, updated_at: updatedAt }])
    .eq('id', id);
}