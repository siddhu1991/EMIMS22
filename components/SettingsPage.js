import { forwardRef } from 'react';
import PropTypes from 'prop-types';
// next
import Head from 'next/head';
// @mui
import { Box } from '@mui/material';
import { LicenseInfo } from '@mui/x-data-grid-pro';
// Components
import SubNavbar from '../layouts/dashboard/navbar/SubNavBar';
// Data Grid Key
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_X_GRID_LICENSE_KEY);

// ----------------------------------------------------------------------

const SettingsPage = forwardRef(({ children, title = '', meta, ...other }, ref) => (
  <>
    <Head>
      <title>{`${title} | EMIMS22`}</title>
      {meta}
    </Head>
    <Box ref={ref} sx={{ display: 'flex' }} {...other}>
      <SubNavbar isCollapse={false} />
      {children}
    </Box>
  </>
));

SettingsPage.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default SettingsPage;
