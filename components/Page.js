import { forwardRef } from 'react';
import PropTypes from 'prop-types';
// next
import Head from 'next/head';
// @mui
import { Box } from '@mui/material';
import { LicenseInfo } from '@mui/x-data-grid-pro';
// Data Grid Key
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_X_GRID_LICENSE_KEY);

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => (
  <>
    <Head>
      <title>{`${title} | EMIMS22`}</title>
      {meta}
    </Head>
    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
