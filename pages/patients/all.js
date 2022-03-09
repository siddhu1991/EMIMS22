import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Container, Card, Button } from '@mui/material';
import { GridToolbarContainer, useGridApiRef, useGridApiContext } from '@mui/x-data-grid-pro';
// Grid
import Search from '../../components/richDataGrid/search';
// layouts
import Layout from '../../layouts';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// contexts
import { PatientsFilterContext } from '../../contexts/PatientsFilterContext';
// components
import Page from '../../components/Page';
import RichDataGrid from '../../components/richDataGrid';
import PageHeading from '../../components/PageHeading';
import Iconify from '../../components/Iconify';
// Table Columns
import columns from '../../table-columns/patients';
// Filters
import { PatientsFilters } from '../../components/filters/patients';
// Database
import { supabase } from '../../utils/supabaseClient';
import hasPermission from '../../utils/checkPermissions';
// Utils
import { fDBDate } from '../../utils/formatTime';
// config
import { cookiesKey, cookiesExpires } from '../../config';
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

export default function Patients() {
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

  useEffect(() => {
    let active = true;

    (async () => {
      setRowsState((prev) => ({ ...prev, loading: true }));
      const newRows = await loadServerRows(rowsState.page, rowsState.pageSize, searchText, filters);

      if (!active) {
        return;
      }
      if (searchText !== '' || filters) {
        setRowsState((prev) => ({ ...prev, loading: false, rows: newRows.data, rowCount: newRows.count }));
      } else {
        setRowsState((prev) => ({ ...prev, loading: false, rows: newRows.data, rowCount: newRows.totalCount }));
      }
    })();

    return () => {
      active = false;
    };
  }, [rowsState.page, rowsState.pageSize, searchText, filters]);

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
        <Search value={searchText} onChange={onSearchTextChange} onClick={clearSearch} />
        <PatientsFilterContext.Provider value={[filters, setFilters]}>
          <PatientsFilters />
        </PatientsFilterContext.Provider>
        <Card>
          <RichDataGrid
            columns={columns(apiRef)}
            {...rowsState}
            autoHeight={true}
            onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
          />
        </Card>
      </Container>
    </Page>
  );
}

async function loadServerRows(page, pageSize, searchText, filters) {
  let query = supabase.from('ems_patients').select(
    `*,
  hospital: hospital_id ( hospital_name ),
  ward: ward_id (ward_name)
  `,
    { count: 'exact' }
  );
  // If search text
  if (searchText != '' && searchText.length > 2) {
    query.ilike('name', '%' + searchText + '%');
  }

  if (filters && filters.length > 0) {
    const formattedFilters = getFormattedFilters(filters);

    // If Date Selected
    if (formattedFilters.date && formattedFilters.date.length > 0) {
      if (formattedFilters.date[0] != null && formattedFilters.date[1] != null) {
        query.gte('created_at', fDBDate(formattedFilters.date[0]));
        query.lte('created_at', fDBDate(formattedFilters.date[1]));
      }
    }
    // If Status Selected
    if (formattedFilters.status && formattedFilters.status.length > 0) {
      query.in('status', formattedFilters.status);
    }
    // If Hospital Selected
    if (formattedFilters.hospital && formattedFilters.hospital.length > 0) {
      query.in('hospital_id', formattedFilters.hospital);
    }
    // If Ward Selected
    if (formattedFilters.ward && formattedFilters.ward.length > 0) {
      query.in('ward_id', formattedFilters.ward);
    }
    // If Gender Selected
    if (formattedFilters.gender && formattedFilters.gender.length > 0) {
      query.in('gender', formattedFilters.gender);
    }
  }
  // Pagination
  query.range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, count, error } = await query;

  const { count: totalCount } = await supabase.from('ems_patients').select('*', { count: 'exact' });

  if (error) {
    console.log(error);
  }

  return { data, count, totalCount };
}

// ----------------------------------------------------------------------

// Format the filters
function getFormattedFilters(filters) {
  let formattedFilters = {
    date: [],
    status: [],
    hospital: [],
    ward: [],
    gender: [],
  };
  filters.forEach((filter) => {
    switch (filter.field) {
      case 'date':
        formattedFilters.date.push(filter.value[0]);
        formattedFilters.date.push(filter.value[1]);
        break;

      case 'status':
        formattedFilters.status.push(filter.value);
        break;

      case 'hospital':
        formattedFilters.hospital.push(filter.value);
        break;

      case 'ward':
        formattedFilters.ward.push(filter.value);
        break;

      case 'gender':
        formattedFilters.gender.push(filter.value);
        break;

      default:
        break;
    }
  });

  return formattedFilters;
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
