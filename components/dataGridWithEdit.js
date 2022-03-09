// @mui
import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';

export default function dataGridWithEdit({ rows, columns, apiRef, ...other }) {
  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellFocusOut = (params, event) => {
    event.defaultMuiPrevented = true;
  };

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
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoHeight={true}
        apiRef={apiRef}
        editMode="row"
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        onCellFocusOut={handleCellFocusOut}
        {...other}
      />
    </Box>
  );
}
