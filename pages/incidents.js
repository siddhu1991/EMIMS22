// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Card } from '@mui/material';
// layouts
import Layout from '../layouts';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Iconify from '../components/Iconify';
//import IncidentsDataGrid from '../components/incidents';

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

Incidents.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Incidents() {
  return (
    <Page title="Incidents">
      <Container maxWidth="false">
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Incidents', href: PATH_DASHBOARD.incidents.root },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.root} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New User
              </Button>
            </NextLink>
          }
        />
        <Card>
          Table coming soon.
        </Card>
      </Container>
    </Page>
  );
}
