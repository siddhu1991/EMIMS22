import { useState } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Stack, MenuItem } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import ThemeMode from '../header/ThemeMode';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.root,
  },
];

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  border: '1px solid #D5F5F6',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    boxShadow: theme.customShadows.z1,
    cursor: 'pointer',
    borderBottom: '0'
  },
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const router = useRouter();

  const theme = useTheme();

  const { userMeta, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(PATH_AUTH.login);

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <Box>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
            border: '0',
          }),
          ...(open && {
            bgcolor: theme.palette.background.paper,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }),
        }}
        onClick={handleOpen}
      >
        <Box sx={{ display: 'flex', cursor: 'pointer' }}>
          <MyAvatar />
          <Box
            sx={{
              ml: 2,
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.shorter,
                }),
              ...(isCollapse && {
                ml: 0,
                width: 0,
              }),
            }}
          >
            <Typography variant="subtitle2" noWrap>
              {userMeta?.first_name} {userMeta?.last_name}
            </Typography>
            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {userMeta?.user_role.name}
            </Typography>
          </Box>
        </Box>
      </RootStyle>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        disabledArrow={true}
        sx={{
          p: 0,
          mt: 0,
          ml: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: 'none',
          border: '1px solid #D5F5F6',
          borderTop: '0',
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <NextLink key={option.label} href={option.linkTo} passHref>
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </NextLink>
          ))}
        </Stack>
        <Stack sx={{ mx: 1 }}>
          <ThemeMode />
        </Stack>

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </Box>
  );
}
