// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { userMeta } = useAuth();

  return (
    <Avatar
      src={userMeta?.avatar_url}
      alt={userMeta?.name}
      color={userMeta?.avatar_url ? 'default' : createAvatar(userMeta?.name).color}
      sx={{ width: '44px', height: '44px' }}
      {...other}
    >
      {createAvatar(userMeta?.name).name}
    </Avatar>
  );
}
