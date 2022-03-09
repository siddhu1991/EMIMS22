// Database
import { supabase } from '../utils/supabaseClient';

export async function getUserById(userId) {
  return await supabase.from('ems_users').select(`*, user_role: ems_user_roles ( name )`).eq('id', userId);
}

export async function getUserPermissions(roleId) {
  return await supabase.from('ems_role_permission').select(`permissions: ems_permissions ( * )`).eq('role_id', roleId);
}

export async function getUserRoles() {
  return await supabase.from('ems_user_roles').select(`*`);
}

export async function signUpUser(data) {
  return await supabase.auth.signUp({
    email: data.email,
    password: 'example-password',
  });
}

export async function updateUserData(id, data) {
  const hospitals = [];
  if(data.hospital_permissions){
    const selectedHospitals = data.hospital_permissions;
    selectedHospitals.forEach((hospital,index) => {
      if (hospital == true) {
        hospitals.push(index);
      }
    });
  }
  console.log(hospitals);

  return await supabase
  .from('ems_users')
  .update([
    { first_name: data.first_name, last_name: data.last_name, email: data.email, phone: data.phoneNumber, is_approver: data.approver, role: parseInt(data.role), hospital_id: parseInt(data.hospital), ward_id: parseInt(data.ward), status: data.status, hospital_permissions: JSON.stringify(hospitals) },
  ])
	.eq('id', id)
}
