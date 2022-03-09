// hooks
import useAuth from '../hooks/useAuth';

export default function checkPermissions(permName) {
  const { permissions } = useAuth();
  let hasPermission = false;
  if (permissions.length > 0) {
    permissions.map(function (permission) {
      if (permission.permissions.slug == permName) {
        console.log(permission.permissions.slug + permName);
        hasPermission = true;
      }
    });
  }
  return hasPermission;
}

// Has Menu Access
export function hasMenuAccess(permName) {
  const { permissions } = useAuth();
  let hasMenuAccess = false;

  if (permissions.length > 0) {
    if (permName == '') {
      hasMenuAccess = true;
    } else {
      permissions.map(function (permission) {
        if (permission.permissions.slug == permName) {
          hasMenuAccess = true;
        }
      });
    }
  }
  return hasMenuAccess;
}
