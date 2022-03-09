import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// @mui
import { Box, Link, Typography, Breadcrumbs as MUIBreadcrumbs } from '@mui/material';

// ----------------------------------------------------------------------

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------

LinkItem.propTypes = {
  link: PropTypes.shape({
    href: PropTypes.string,
    icon: PropTypes.any,
    name: PropTypes.string,
  }),
};

function LinkItem({ link }) {
  const { href = '', name, icon } = link;
  return (
    <NextLink href={href} passHref>
      <Link
        key={name}
        variant="body2"
        sx={{
          lineHeight: 2,
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
          '& > div': { display: 'inherit' },
        }}
      >
        {icon && <Box sx={{ mr: 1, '& svg': { width: 20, height: 20 } }}>{icon}</Box>}
        {name}
      </Link>
    </NextLink>
  );
}