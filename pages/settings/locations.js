// React
import React from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Container, Card } from '@mui/material';
import { useGridApiRef, GridToolbarContainer, GridToolbar, LicenseInfo } from '@mui/x-data-grid-pro';
//Icons
import AddIcon from '@mui/icons-material/Add';
// layouts
import Layout from '../../layouts';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/SettingsPage';
import PageHeading from '../../components/PageHeading';
import DataGridWithEdit from '../../components/dataGridWithEdit';
// Table Columns
import columns from '../../table-columns/locations';
// Database
import { supabase } from '../../utils/supabaseClient';
// Models
import { addLocation, updateLocation } from '../../models/locations';
import { getHospitalNames } from '../../models/hospitals';
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

Locations.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

export default function Locations({ rows, hospitals }) {
  const apiRef = useGridApiRef();
  const { enqueueSnackbar } = useSnackbar();

  function EditToolbar(props) {
    const { apiRef } = props;

    const handleClick = () => {
      const id = Math.floor(100000 + Math.random() * 900000);
      apiRef.current.updateRows([{ id, isNew: true, name: '', updated_at: Date.now(), created_at: Date.now() }]);
      apiRef.current.setRowMode(id, 'edit');
      // Wait for the grid to render with the new row
      setTimeout(() => {
        apiRef.current.scrollToIndexes({
          rowIndex: apiRef.current.getRowsCount() - 1,
        });

        apiRef.current.setCellFocus(id, 'location');
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
        const inserted = await addLocation(newRow);

        if (inserted.error) {
          enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
        } else {
          const { data: hospitals } = await getHospitalNames();
          const updatedRows = formartToRows(inserted.data, hospitals);
          apiRef.current.updateRows([{ id, _action: 'delete' }]);
          apiRef.current.updateRows(updatedRows);
          enqueueSnackbar('Location Inserted Successfully!', { variant: 'success' });
        }
      } else {
        const updated = await updateLocation(id, newRow);
        if (updated.error) {
          apiRef.current.updateRows([oldRow]);
          enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
        } else {
          const { data: hospitals } = await getHospitalNames();
          const updatedRows = formartToRows(updated.data, hospitals);
          apiRef.current.updateRows(updatedRows);
          enqueueSnackbar('Location updated Successfully!', { variant: 'success' });
        }
      }
    },
    [apiRef]
  );

  return (
    <Page title="Locations">
      <Container maxWidth="false">
        <PageHeading heading="Locations" />
        <Card>
          <DataGridWithEdit
            rows={rows}
            columns={columns(apiRef, hospitals)}
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
  let query = supabase.from('ems_locations').select('*');

  const { data, error } = await query;

  const { data: hospitals } = await getHospitalNames();

  if (error) {
    throw new Error(error);
  }

  const rows = formartToRows(data, hospitals);

  return {
    props: {
      rows: rows,
      hospitals: hospitals,
    },
  };
}

function formartToRows(data, hospitals){
  // Manipulating Data to show hospitals as columns
  const rows = [];
  if (data) {
    data.forEach((location) => {
      const row = new Object();
      row.id = location.id;
      row.location= location.name;
      hospitals.forEach((hospital) => {
        const hospitals = location.hospital_id.id;
        const hospital_id_label = 'hos_'+hospital.id;
        if(hospitals.includes(hospital.id)){
          row[hospital_id_label] = true;
        }else{
          row[hospital_id_label] = false;
        }
      });
      row.created_at = location.created_at;
      rows.push(row);
    });
  }
  return rows;
}