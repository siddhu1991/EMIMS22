import PropTypes from 'prop-types';
import isString from 'lodash/isString';
// @mui
import { Box, Typography, Link } from '@mui/material';

// ----------------------------------------------------------------------

PageHeading.propTypes = {
  heading: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default function PageHeading({ heading, action, sx, ...other }) {
  return (
    <Box sx={{ mb: 5, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3">{heading}</Typography>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
    </Box>
  );
}
