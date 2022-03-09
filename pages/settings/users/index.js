// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Container, Card, Button } from '@mui/material';
import { DataGridPro, GridToolbar, useGridApiRef } from '@mui/x-data-grid-pro';
// layouts
import Layout from '../../../layouts';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/SettingsPage';
import PageHeading from '../../../components/PageHeading';
import Iconify from '../../../components/Iconify';
// Table Columns
import columns from '../../../table-columns/users';
// Database
import { supabase } from '../../../utils/supabaseClient';
import hasPermission from '../../../utils/checkPermissions';

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

Users.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Users({ rows }) {
  const theme = useTheme();
  const router = useRouter();
  const apiRef = useGridApiRef();

  // Direct to dashboard If user does not have permission
  if (!hasPermission('view_users')) {
    router.push(PATH_DASHBOARD.root);
  }

  return (
    <Page title="Users">
      <Container maxWidth="false">
        <PageHeading
          heading="Users"
          action={
            <NextLink href={PATH_DASHBOARD.settings.newUser} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New User
              </Button>
            </NextLink>
          }
        />
        <Card>
          <DataGridPro
            rows={rows}
            columns={columns(apiRef)}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight={true}
            initialState={{
              columns: {
                columnsVisibilityModel: {
                  user_system_id: false,
                  user_elern_mede_id: false,
                },
              },
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Card>
      </Container>
    </Page>
  );
}

/* Load the Dyanmic Data from Supabase*/
export async function getServerSideProps() {
  let query = supabase.from('ems_users').select(`
	*,
	hospital: hospital_id ( hospital_name ),
	ward: ward_id (ward_name),
  role_name: role (name)
	`);

  const { data, error } = await query;
  console.log(data);
  if (error) {
    console.log(error);
  }

  return {
    props: {
      rows: data,
    },
  };
}
