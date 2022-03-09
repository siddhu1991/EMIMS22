// Database
import { supabase } from '../utils/supabaseClient';

export async function getPatients() {
  return await supabase.from('ems_patients').select('*');
}

export async function getPatientById(patientId) {
  return await supabase.from('ems_patients').select(`*`).eq('id', patientId);
}

export async function deletePatient(id) {
  return await supabase.from('ems_patients').delete().eq('id', id);
}

export async function addPatient(data) {
  return await supabase.from('ems_patients').insert([
    {
      name: data.name,
      gender: data.gender,
      hospital_id: parseInt(data.hospital),
      ward_id: parseInt(data.ward),
      status: data.status,
      patient_code: data.patient_code,
      risk_level: data.risk_level,
      dob: data.dob,
      room_id: data.room_id,
      created_at: data.created,
      updated_at: data.updated,
    },
  ]);
}

export async function updatePatient(id, data) {
  return await supabase
    .from('ems_patients')
    .update([
      {
        name: data.name,
        gender: data.gender,
        hospital_id: parseInt(data.hospital),
        ward_id: parseInt(data.ward),
        status: data.status,
        patient_code: data.patient_code,
        risk_level: data.risk_level,
        dob: data.dob,
        room_id: data.room_id,
        updated_at: data.updated,
      },
    ])
    .eq('id', id);
}
