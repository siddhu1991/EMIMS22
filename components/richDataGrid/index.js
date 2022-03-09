import * as React from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Stack } from '@mui/material';
import { DataGridPro, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid-pro';
import DataGridPagination from './pagination';
// Components
import Iconify from '../Iconify';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton startIcon={<Iconify icon={'heroicons-outline:cog'} />} />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function RichDataGrid({ rows, columns, apiRef, ...other }) {
  const rowsPerPageOptions = [1, 2, 5, 10, 20];

  return (
    <Box
      sx={{
        '& .MuiDataGrid-cell--editing': {
          bgcolor: 'rgb(255,215,115, 0.19)',
          color: '#1a3e72',
          '& .MuiInputBase-root': {
            height: '100%',
          },
        },
        '& .Mui-error': {
          bgcolor: (theme) => `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
          color: (theme) => (theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f'),
        },
      }}
    >
      <DataGridPro
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        pagination
        paginationMode="server"
        rowsPerPageOptions={rowsPerPageOptions}
        components={{
          Pagination: DataGridPagination,
          Toolbar: CustomToolbar,
          NoRowsOverlay: () => (
            <Stack
              height="100%"
              alignItems="center"
              justifyContent="center"
              sx={{ position: 'absolute', top: 16, left: 0, width: '100%' }}
            >
              No Results
            </Stack>
          ),
        }}
        {...other}
      />
    </Box>
  );
}
