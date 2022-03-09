// React
import { useSnackbar } from 'notistack';
// @Mui
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
//Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
// Utils
import { fDate } from '../utils/formatTime';
// Models
import { deleteWard } from '../models/wards';

const columns = (hospitals, apiRef) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, 'edit');
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();

    const deleted = deleteWard(id);
    if (deleted.error) {
      enqueueSnackbar('Something went wrong, Please try again!', { variant: 'error' });
    } else {
      apiRef.current.updateRows([{ id, _action: 'delete' }]);
      enqueueSnackbar('Ward deleted Successfully!', { variant: 'success' });
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
    {
      field: 'hospital',
      headerName: 'Hospital Name',
      width: '300',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: hospitals.map((hospitals) => {
        return hospitals.hospital_name;
      }),
      valueGetter: (params) => {
        if (params.value != '' && typeof params.value.hospital_name !== 'undefined') {
          return params.value.hospital_name;
        } else {
          return params.value;
        }
      },
      preProcessEditCellProps: (params) => {
        let hasError = false;
        if(params.props.value == ''){
          hasError = true;
        }
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'ward_name',
      headerName: 'Ward Name',
      flex: 1,
      editable: true,
      width: '200',
      preProcessEditCellProps: (params) => {
        let hasError= false;
        if(params.props.value == null || params.props.value == ''){
          hasError = true;
        }
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: '200',
      flex: 1,
      type: 'date',
      valueGetter: (params) => {
        return fDate(params.value);
      },
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      width: '200',
      flex: 1,
      type: 'date',
      valueGetter: (params) => {
        return fDate(params.value);
      },
    },
    {
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
    },
  ];
  return col;
};
export default columns;
