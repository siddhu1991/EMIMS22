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
import Iconify from '../../components/Iconify';
// Table Columns
import columns from '../../table-columns/sections';
// Utils
import { fDate } from '../../utils/formatTime';
// Database
import { supabase } from '../../utils/supabaseClient';
// Models
import { addSection, updateSection } from '../../models/sections';
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

Sections.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};
export default function Sections({ rows }) {
  const apiRef = useGridApiRef();
  const { enqueueSnackbar } = useSnackbar();

  function EditToolbar(props) {
    const { apiRef } = props;

    const handleClick = () => {
      const id = Math.floor(100000 + Math.random() * 900000);
      apiRef.current.updateRows([{ id, isNew: true, name:'', updated_at: Date.now(), created_at: Date.now() }]);
      apiRef.current.setRowMode(id, 'edit');
      // Wait for the grid to render with the new row
      setTimeout(() => {
        apiRef.current.scrollToIndexes({
          rowIndex: apiRef.current.getRowsCount() - 1,
        });

        apiRef.current.setCellFocus(id, 'name');
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
        const inserted = await addSection(newRow);

        if (inserted.error) {
          enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
        } else {
          apiRef.current.updateRows([{ id, _action: 'delete' }]);
          apiRef.current.updateRows([
            {
              id: inserted.data[0].id,
              name: newRow.name.value,
              updated_at: fDate(inserted.data[0].updated_at),
              created_at: fDate(inserted.data[0].created_at),
            },
          ]);
          enqueueSnackbar('Section Inserted Successfully!', { variant: 'success' });
        }
      } else {
        const updated = await updateSection(id, newRow, fDate(Date.now()));
        if (updated.error) {
          apiRef.current.updateRows([oldRow]);
          enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
        } else {
          apiRef.current.updateRows([{ id, updated_at: fDate(updated.data[0].updated_at) }]);
          enqueueSnackbar('Section updated Successfully!', { variant: 'success' });
        }
      }
    },
    [apiRef]
  );
  return (
    <Page title="Sections">
      <Container maxWidth="false">
        <PageHeading heading="Sections" />
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
  let query = supabase.from('ems_sections').select('*');

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
