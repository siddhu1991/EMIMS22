import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Container, Card, Button } from '@mui/material';
import { DataGridPro, GridToolbar, useGridApiRef } from '@mui/x-data-grid-pro';
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
// Grid
import Search from '../../components/richDataGrid/search';
// config
import { cookiesKey, cookiesExpires } from '../../config';
// contexts
import { IncidentsFilterContext } from '../../contexts/IncidentsFilterContext';
// Filters
import { IncidentsFilters } from '../../components/filters/incidents';


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

export default function Incidents({ rows }) {
  const theme = useTheme();
  const router = useRouter();
  const apiRef = useGridApiRef();

  // Direct to dashboard If user does not have permission
  if (!hasPermission('view_patients')) {
    router.push('/');
  }

  // Set the Filters if it is available in cookie
  const loadDefaultFilters = () => {
    const defaultCookieFilters = Cookies.get(cookiesKey.PatientsFilter);
    if (defaultCookieFilters && defaultCookieFilters != '') {
      return JSON.parse(defaultCookieFilters);
    } else {
      return [];
    }
  };

  // Set the Search if it is available in cookie
  const loadDefaultSearch = () => {
    const defaultCookieSearch = Cookies.get(cookiesKey.PatientsSearchText);
    if (defaultCookieSearch && defaultCookieSearch != '') {
      return defaultCookieSearch;
    } else {
      return '';
    }
  }; 

   // State Management
   const [searchText, setSearchText] = usePatientsSearchCookies(loadDefaultSearch());
   const [filters, setFilters] = usePatientsFilterCookies(loadDefaultFilters());
   const [rowsState, setRowsState] = useState({
    page: 0,
    pageSize: 3,
    rowCount: 0,
    rows: {},
    loading: false,
  });

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    setRowsState((prev) => ({ ...prev, page: 0 }));
  }; 

  const onSearchTextChange = (event) => {
    requestSearch(event.target.value);
  };

  const clearSearch = () => requestSearch('');

  return (
    <Page title="Incidents">
      <Container maxWidth="false">
        <PageHeading
          heading="Incidents"
          action={
            <NextLink href={PATH_DASHBOARD.patients.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Incidents
              </Button>
            </NextLink>
          }
        />
        <Search value={searchText} onChange={onSearchTextChange} onClick={clearSearch} />
        <IncidentsFilterContext.Provider value={[filters, setFilters]}>
           <IncidentsFilters /> 
        </IncidentsFilterContext.Provider>
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
  let query = supabase.from('ems_patients').select(`
  *,
  hospital: hospital_id ( hospital_name ),
  ward: ward_id (ward_name)
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

// ----------------------------------------------------------------------


// Set Filter Cookie
function usePatientsFilterCookies(defaultFilters) {
  const [filters, setFilters] = useState(defaultFilters);

  const onChangeFilter = () => {
    Cookies.set(cookiesKey.PatientsFilter, JSON.stringify(filters), { expires: cookiesExpires });
  };

  useEffect(() => {
    onChangeFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return [filters, setFilters];
}
 // Set Search Cookie
function usePatientsSearchCookies(defaultSearchText) {
  const [searchText, setSearchText] = useState(defaultSearchText);

  const onChangeFilter = () => {
    Cookies.set(cookiesKey.PatientsSearchText, searchText, { expires: cookiesExpires });
  };

  useEffect(() => {
    onChangeFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return [searchText, setSearchText];
}