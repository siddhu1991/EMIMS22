// Database
import { supabase } from '../utils/supabaseClient';

export async function getWards() {
  return await supabase.from('ems_wards').select('*');
}

export async function deleteWard(id) {
  return await supabase.from('ems_wards').delete().eq('id', id);
}

export async function addWard(rowData, hospitals) {
  const hospitalId = getHospitalName(rowData.hospital.value, hospitals);

  return await supabase.from('ems_wards').insert([{ hospital_id: hospitalId, ward_name: rowData.ward_name.value }]);
}

export async function updateWard(id, rowData, hospitals, updatedAt) {
  const hospitalId = getHospitalName(rowData.hospital.value, hospitals);

  return await supabase
    .from('ems_wards')
    .update([{ hospital_id: hospitalId, ward_name: rowData.ward_name.value, updated_at: updatedAt }])
    .eq('id', id);
}

function getHospitalName(hospital_name, hospitals) {
  let hospital_id = '';
  hospitals.map((hospital) => {
    if (hospital.hospital_name == hospital_name) {
      hospital_id = hospital.id;
    }
  });
  return hospital_id;
}
