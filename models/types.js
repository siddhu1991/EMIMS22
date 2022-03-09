// Database
import { supabase } from '../utils/supabaseClient';

export async function deleteType(id) {
  return await supabase.from('ems_incident_types').delete().eq('id', id);
}

export async function addType(rowData) {
  return await supabase.from('ems_incident_types').insert([{ name: rowData.name.value, alert: rowData.alert.value, review: rowData.review.value }]);
}

export async function updateType(id, rowData, updatedAt) {
  return await supabase
    .from('ems_incident_types')
    .update([{ name: rowData.name.value, alert: rowData.alert.value, review: rowData.review.value, updated_at: updatedAt }])
    .eq('id', id);
}