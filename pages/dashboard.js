// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Grid, Button } from '@mui/material';
// layouts
import Layout from '../layouts';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import PageHeading from '../components/PageHeading';
import Iconify from '../components/Iconify';
import useAuth from '../hooks/useAuth';
// sections
import IncidentThisWeek from '../sections/reports/IncidentThisWeek';
import IncidentSeverty from '../sections/reports/IncidentSeverty';
import AnalyticsConversionRates from '../sections/reports/AnalyticsConversionRates';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

Dashboard.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Dashboard() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="false">
        <PageHeading
          heading="Dashboard"
          action={
            <NextLink href={PATH_DASHBOARD.root} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Incident
              </Button>
            </NextLink>
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <IncidentThisWeek />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <IncidentSeverty />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsConversionRates />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <IncidentThisWeek />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
