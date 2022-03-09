import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------
const Logo = forwardRef(({ disabledLink = false, sx, isCollapse, sidebar = false, isLoading = false }, ref) => {
  let logo = '';
  if (sidebar) {
    logo = (
      <>
        <Box
          ref={ref}
          sx={{
            width: 25,
            height: 25,
            cursor: 'pointer',
            ...(!isCollapse && {
              width: 0,
            }),
            ...sx,
          }}
        >
          <img alt="logo-small" src="/images/logo-small.svg" height="25" />
        </Box>
        <Box
          ref={ref}
          sx={{
            width: 160,
            height: 25,
            cursor: 'pointer',
            ...(isCollapse && {
              width: 0,
            }),
            ...sx,
          }}
        >
          <img alt="logo" src="/images/logo.svg" />
        </Box>
      </>
    );
  } else if (isLoading) {
    logo = (
      <Box ref={ref} sx={{ display: 'flex', cursor: 'pointer', ...sx }}>
        <img alt="logo-small" src="/images/logo-small.svg" />
      </Box>
    );
  } else {
    logo = (
      <>
        <Box
          ref={ref}
          sx={{
            width: 160,
            height: 25,
            ...sx,
          }}
        >
          <img alt="logo" src="/images/logo.svg" />
        </Box>
      </>
    );
  }

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <NextLink href="/">{logo}</NextLink>;
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  isCollapse: PropTypes.bool,
};

export default Logo;
