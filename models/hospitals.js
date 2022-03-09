// Database
import { supabase } from '../utils/supabaseClient';

export async function getHospitals() {
  return await supabase.from('ems_hospitals').select('*');
}

export async function getHospitalNames() {
  return await supabase.from('ems_hospitals').select('id, hospital_name');
}

export async function deleteHospital(id) {
  return await supabase.from('ems_hospitals').delete().eq('id', id);
}

export async function addHospital(rowData) {
  return await supabase.from('ems_hospitals').insert([{ hospital_name: rowData.hospital_name.value }]);
}

export async function updateHospital(id, rowData, updatedAt) {

  return await supabase
    .from('ems_hospitals')
    .update([{ hospital_name: rowData.hospital_name.value, updated_at: updatedAt }])
    .eq('id', id);
}