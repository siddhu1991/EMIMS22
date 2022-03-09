// React
import React from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Card, Typography } from '@mui/material';
import { useGridApiRef, GridToolbarContainer, GridToolbar } from '@mui/x-data-grid-pro';
//Icons
import AddIcon from '@mui/icons-material/Add';
// layouts
import Layout from '../../layouts';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/SettingsPage';
import PageHeading from '../../components/PageHeading';
import Iconify from '../../components/Iconify';
import DataGridWithEdit from '../../components/dataGridWithEdit';
// Table Columns
import columns from '../../table-columns/hospitals';
// Database
import { supabase } from '../../utils/supabaseClient';
// Utils
import { fDate } from '../../utils/formatTime';
// Models
import { addHospital, updateHospital } from '../../models/hospitals';
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

Hospitals.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Hospitals({ rows }) {
  const apiRef = useGridApiRef();
  const { enqueueSnackbar } = useSnackbar();

  function EditToolbar(props) {
    const { apiRef } = props;

    const handleClick = () => {
      const id = Math.floor(100000 + Math.random() * 900000);
      apiRef.current.updateRows([{ id, isNew: true, hospital_name: '', updated_at: Date.now(), created_at: Date.now() }]);
      apiRef.current.setRowMode(id, 'edit');
      // Wait for the grid to render with the new row
      setTimeout(() => {
        apiRef.current.scrollToIndexes({
          rowIndex: apiRef.current.getRowsCount() - 1,
        });

        apiRef.current.setCellFocus(id, 'hospital_name');
      });
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  EditToolbar.propTypes = {
    apiRef: PropTypes.shape({
      current: PropTypes.object.isRequired,
    }).isRequired,
  };

  const handleRowEditCommit = React.useCallback(
    async (id) => {
      const model = apiRef.current.getEditRowsModel(); // This object contains all rows that are being edited
      const newRow = model[id]; // The data that will be committed
      // Get the row old value before committing
      const oldRow = apiRef.current.getRow(id);

      if (oldRow.isNew) {
        const inserted = await addHospital(newRow);

        if (inserted.error) {
          enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
        } else {
          apiRef.current.updateRows([{ id, _action: 'delete' }]);
          apiRef.current.updateRows([
            {
              id: inserted.data[0].id,
              hospital_name: newRow.hospital_name.value,
              updated_at: fDate(inserted.data[0].updated_at),
              created_at: fDate(inserted.data[0].created_at),
            },
          ]);
          enqueueSnackbar('Hospital Inserted Successfully!', { variant: 'success' });
        }
      } else {
        const updated = await updateHospital(id, newRow, fDate(Date.now()));
        console.log(updated);
        if (updated.error) {
          apiRef.current.updateRows([oldRow]);
          enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
        } else {
          apiRef.current.updateRows([{ id, updated_at: fDate(updated.data[0].updated_at) }]);
          enqueueSnackbar('Hospital updated Successfully!', { variant: 'success' });
        }
      }
    },
    [apiRef]
  );
  return (
    <Page title="Hospitals">
      <Container maxWidth="false">
        <PageHeading heading="Hospitals" />
        <Card>
          <DataGridWithEdit
            rows={rows}
            columns={columns(apiRef)}
            apiRef={apiRef}
            components={{
              Toolbar: EditToolbar,
            }}
            componentsProps={{
              toolbar: { apiRef },
            }}
            onRowEditCommit={handleRowEditCommit}
          />
        </Card>
      </Container>
    </Page>
  );
}

/* Load the Dyanmic Data from Supabase*/
export async function getServerSideProps() {
  let query = supabase.from('ems_hospitals').select('*');

  const { data, error } = await query;

  if (error) {
    throw new Error(error);
  }

  return {
    props: {
      rows: data,
    },
  };
}
