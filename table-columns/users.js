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
    router.push(PATH_DASHBOARD.settings.editUser + '/' + id);
  };

  const cols = [
    {
      field: 'avatar_url',
      headerName: 'Profile Pic',
      renderCell: (params) => {
        if (params) {
          return <Avatar image={params.value} />;
        }
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: '200',
      hideable: false,
      valueGetter: (params) => {
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
      },
    },
    { field: 'email', headerName: 'Email', width: '200' },
    { field: 'phone', headerName: 'Phone', hide: true },
    {
      field: 'role_name',
      headerName: 'Role',
      hide: true,
      valueFormatter: (params) => {
        if (params) {
          return params.value.name;
        } else {
          return '';
        }
      },
    },
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
      field: 'user_system_id',
      headerName: 'User System ID',
      width: '100',
      hide: true,
    },
    {
      field: 'user_elern_mede_id',
      headerName: 'Elern Mede ID',
      width: '100',
      hide: true,
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
      flex: 1,
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
