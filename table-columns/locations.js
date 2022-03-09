import { useState } from 'react';
// React
import { useSnackbar } from 'notistack';
// @Mui
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
//Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
// Models
import { deleteLocation } from '../models/locations';

const columns = (apiRef, hospitals) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, 'edit');
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();

    const deleted = deleteLocation(id);
    if (deleted.error) {
      enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
    } else {
      apiRef.current.updateRows([{ id, _action: 'delete' }]);
      enqueueSnackbar('Location deleted Successfully!', { variant: 'success' });
    }
  };

  const handleSaveClick = (id) => async (event) => {
    event.stopPropagation();
    // Wait for the validation to run
    const isValid = await apiRef.current.commitRowChange(id);
    if (isValid) {
      apiRef.current.setRowMode(id, 'view');
      const row = apiRef.current.getRow(id);
      apiRef.current.updateRows([{ ...row, isNew: false }]);
    } else {
      enqueueSnackbar('Please fill the required fields first', { variant: 'error' });
    }
  };

  const handleCancelClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, 'view');

    const row = apiRef.current.getRow(id);
    if (row.isNew) {
      apiRef.current.updateRows([{ id, _action: 'delete' }]);
    }
  };
  const col = [
    { field: 'id', headerName: 'ID', width: 100, hide: true },
    { field: 'location', headerName: 'Location', width: '200', editable: true },
  ];
  hospitals.forEach((hospital) => {
    col.push({
      field: 'hos_' + hospital.id,
      headerName: hospital.hospital_name,
      width: '200',
      editable: true,
      type: 'boolean'
    });
  });
  col.push({
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    flex: 1,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

      if (isInEditMode) {
        return [
          <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} color="primary" />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
      ];
    },
  });
	console.log(col);
  return col;
};
export default columns;
