// Next
import { useRouter } from 'next/router';
// @MUI
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
// Components
import Iconify from '../components/Iconify';
import Avatar from '../components/userAvatar';
import Label from '../components/Label';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
//Icons
import EditIcon from '@mui/icons-material/Edit';
// Utils
import { fDate } from '../utils/formatTime';

const columns = (apiRef) => {
  const theme = useTheme();
  const router = useRouter();

  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    router.push(PATH_DASHBOARD.patients.edit + '/' + id);
  };

  const cols = [
    {
      field: 'avatar_url',
      headerName: '',
      renderCell: (params) => {
        if (params) {
          return <Avatar image={params.value} />;
        }
      },
    },
    { field: 'name', headerName: 'Name', width: '200' },
    {
      field: 'gender',
      headerName: 'Gender',
      width: '200',
      valueGetter: (params) => {
        return params.value == 'male' ? 'Male' : 'Female';
      },
    },
    {
      field: 'dob',
      headerName: 'DOB',
      width: '200',
      valueGetter: (params) => {
        return fDate(params.value);
      },
    },
    { field: 'patient_code', headerName: 'Patient Code', width: '200' },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => {
        if (params.value == true) {
          return (
            <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'success'}>
              Active
            </Label>
          );
        } else {
          return (
            <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'error'}>
              In Active
            </Label>
          );
        }
      },
    },
    {
      field: 'hospital',
      headerName: 'Hospital Name',
      width: '200',
      valueGetter: (params) => {
        if (params.value) {
          return params.value.hospital_name;
        } else {
          return params.value;
        }
      },
    },
    {
      field: 'ward',
      headerName: 'Ward',
      width: '150',
      valueGetter: (params) => {
        if (params.value) {
          return params.value.ward_name;
        } else {
          return params.value;
        }
      },
    },
    {
      field: 'risk_level',
      headerName: 'Risk Level',
      width: '100',
    },
    {
      field: 'room_id',
      headerName: 'Room ID',
      width: '100',
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: '200',
      valueGetter: (params) => {
        return fDate(params.value);
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return cols;
};
export default columns;
