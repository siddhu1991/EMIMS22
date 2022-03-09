// Database
import { supabase } from '../utils/supabaseClient';

export async function getLocations() {
  return await supabase.from('ems_locations').select('*');
}

export async function deleteLocation(id) {
  return await supabase.from('ems_locations').delete().eq('id', id);
}

export async function addLocation(rowData) {
  const hospitals = [];
  let hospital_ids = '';
  if (rowData) {
    Object.keys(rowData).forEach((index) => {
      if (index.includes('hos_') && rowData[index].value == true) {
        const hospital_id_label = index.replace('hos_', '');
        hospitals.push(parseInt(hospital_id_label));
      }
    });
  }
  hospital_ids = { id: hospitals };
  return await supabase.from('ems_locations').insert([{ name: rowData.location.value, hospital_id: hospital_ids }]);
}

export async function updateLocation(id, rowData) {
  const hospitals = [];
  let hospital_ids = '';
  if (rowData) {
    Object.keys(rowData).forEach((index) => {
      if (index.includes('hos_') && rowData[index].value == true) {
        const hospital_id_label = index.replace('hos_', '');
        hospitals.push(parseInt(hospital_id_label));
      }
    });
  }
  hospital_ids = { id: hospitals };

  return await supabase
    .from('ems_locations')
    .update([{ name: rowData.location.value, hospital_id: hospital_ids }])
    .eq('id', id);
}
