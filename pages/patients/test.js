import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Container, Card, Button } from '@mui/material';
import {
  DataGridPro,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
// layouts
import Layout from '../../layouts';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import PageHeading from '../../components/PageHeading';
import Iconify from '../../components/Iconify';
// Table Columns
import columns from '../../table-columns/patients';
// Database
import { supabase } from '../../utils/supabaseClient';
import hasPermission from '../../utils/checkPermissions';
import Pagination from '@mui/material/Pagination';
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

Patients.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------
function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => {
        apiRef.current.setPage(value - 1);
        console.log(value);
      }}
    />
  );
}
// ----------------------------------------------------------------------

export default function Patients() {
  const theme = useTheme();
  const router = useRouter();
  const apiRef = useGridApiRef();

  // Direct to dashboard If user does not have permission
  if (!hasPermission('view_patients')) {
    router.push('/');
  }
  const [searchText, setSearchText] = useState('');
  const [count, setCount] = useState(0);
  const [rowsState, setRowsState] = useState({
    page: 0,
    pageSize: 3,
    rows: {},
    loading: false,
  });

  const rowCount = async () => {
    const { count } = await supabase.from('ems_patients').select('*', { count: 'exact' });
    setCount(count);
  };

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
  };

  useEffect(() => {
    let active = true;
    console.log(rowsState.page);
    (async () => {
      rowCount();
      setRowsState((prev) => ({ ...prev, loading: true }));
      const newRows = await loadServerRows(rowsState.page, rowsState.pageSize, searchText);

      if (!active) {
        return;
      }

      setRowsState((prev) => ({ ...prev, loading: false, rows: newRows }));
    })();

    return () => {
      active = false;
    };
  }, [rowsState.page, rowsState.pageSize, searchText]);

  return (
    <Page title="Patients">
      <Container maxWidth="false">
        <PageHeading
          heading="Patients"
          action={
            <NextLink href={PATH_DASHBOARD.patients.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Patient
              </Button>
            </NextLink>
          }
        />
        <Card>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGridPro
              columns={columns(apiRef)}
              {...rowsState}
              pagination
              rowCount={count}
              components={{
                Pagination: CustomPagination,
              }}
              paginationMode="server"
              onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

async function loadServerRows(page, pageSize, searchText) {
  let query = supabase.from('ems_patients').select(
    `*,
  hospital: hospital_id ( hospital_name ),
  ward: ward_id (ward_name)
  `
  );
  // If search text
  if (searchText != '' && searchText.length > 2) {
    query.ilike('name', '%' + searchText + '%');
  }
  // Pagination
  query.range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, error } = await query;

  if (error) {
    console.log(error);
  }

  return data;
}
