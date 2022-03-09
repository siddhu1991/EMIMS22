import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Button,
  ToggleButton,
  Checkbox,
  FormGroup,
} from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import Avatar from '../../components/Avatar';
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFCheckbox,
  RHFSwitch,
  RHFMultiCheckbox,
} from '../../components/hook-form';
// Models
import { signUpUser, addUserData, getUserById, updateUserData } from '../../models/users';
// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  hospitals: PropTypes.array,
  wards: PropTypes.array,
  roles: PropTypes.array,
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm({ hospitals, wards, roles, id, currentUser, isEdit = false }) {
  const theme = useTheme();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [hospital, setHospital] = useState();
  const [wardsList, setWardsList] = useState(wards);
  const [permissionChecked, setpermissionChecked] = useState(false);
  const [selected, setSelected] = useState(false);
  const [fullName, setFullName] = useState(false);
  const userId = id;

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    hospital: Yup.number().required('Hospital is required'),
    ward: Yup.number().required('Ward is required'),
    role: Yup.number().required('Role Number is required'),
    hospital_permissions: Yup.array(),
  });

  //const { data: user, error } = useSWR(id, fetchUser);
  if (currentUser) {
    currentUser;
    isEdit = true;
  }
  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phone || '',
      hospital: currentUser?.hospital_id || '',
      ward: currentUser?.ward_id || '',
      avatarUrl: currentUser?.avatar_url || '',
      status: currentUser?.status || false,
      user_status: currentUser?.status || false,
      approver: currentUser?.is_approver || false,
      role: currentUser?.role || '',
      hospital_permissions: currentUser?.hospital_permissions || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if (currentUser) {
      setSelected(currentUser.status);
      setValue('user_status', currentUser.status);
      setFullName(currentUser.first_name + ' ' + currentUser.last_name);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser, status]);

  useEffect(() => {
    if (values) {
      setFullName(values.first_name + ' ' + values.last_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onSubmit = async (data) => {
    if (data) {
      if (isEdit) {
        const updateUserMeta = await updateUserData(userId, data);

        if (!updateUserMeta.error) {
          enqueueSnackbar('User Updated Successfully');
          push(PATH_DASHBOARD.settings.users);
        } else {
          enqueueSnackbar('Something Went Wrong, Please try again');
        }
      } else {
        const { user: createUser } = await signUpUser(data);
        console.log(createUser);
        if (!createUser.error) {
          const addUserMeta = await updateUserData(createUser.id, data);
          if (!addUserMeta.error) {
            reset();
            enqueueSnackbar('User Created Successfully');
            push(PATH_DASHBOARD.settings.users);
          } else {
            enqueueSnackbar('Something Went Wrong, Please try again');
          }
        } else {
          enqueueSnackbar('Something Went Wrong, Please try again');
        }
      }
    } else {
      enqueueSnackbar('Something Went Wrong, Please try again');
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const reloadWards = (e) => {
    const wardArray = [];
    wards.forEach((ward) => {
      if (ward.hospital_id == e.target.value) {
        wardArray.push(ward);
      }
    });
    setWardsList(wardArray);
    setHospital(e.target.value);
    setValue('hospital', hospital);
  };

  const sendSelectedHospital = (id) => {
    if (currentUser && currentUser.hospital_permissions) {
      if (currentUser.hospital_permissions.includes(id)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ flexGrow: 1, mb: 3 }}>
              <Typography variant="h4">User Information</Typography>
            </Box>
            <Box>
              {isEdit && (
                <Label
                  color={values.status !== true ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status == true ? 'Active' : 'Inactive'}
                </Label>
              )}
            </Box>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="first_name" clabel="First Name" />
              <RHFTextField name="last_name" clabel="Last Name" />
              <RHFTextField name="email" clabel="Email Address" />
              <RHFTextField name="phoneNumber" clabel="Phone Number" />
              <RHFSelect name="hospital" clabel="Hospital" placeholder="Select Hospital" onChange={reloadWards}>
                <option value=""></option>
                {hospitals.length > 0
                  ? hospitals.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.hospital_name}
                      </option>
                    ))
                  : ''}
              </RHFSelect>

              <RHFSelect name="ward" clabel="Ward" placeholder="Select Ward">
                <option value=""></option>
                {wardsList.length > 0
                  ? wardsList.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.ward_name}
                      </option>
                    ))
                  : ''}
              </RHFSelect>

              <RHFSelect name="role" clabel="Role" placeholder="Select Role">
                <option value=""></option>
                {roles.length > 0
                  ? roles.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))
                  : ''}
              </RHFSelect>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Grid container sx={{ py: 3 }}>
                <Grid item xs={12}>
                  <Box xs={12} md={8} sx={{ mb: 1 }}>
                    <RHFUploadAvatar
                      name="avatarUrl"
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      file={currentUser?.avatar_url}
                      imageName={fullName}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 2,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.secondary',
                          }}
                        >
                          Allowed *.jpeg, *.jpg, *.png, *.gif max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Hospital Access
              </Typography>

              {hospitals.map((hospital, index) => (
                <RHFCheckbox
                  name={'hospital_permissions[' + hospital.id + ']'}
                  label={hospital.hospital_name}
                  value={sendSelectedHospital(hospital.id)}
                  key={index}
                />
              ))}

              {isEdit && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked ? true : false)}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        User Status
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User will not able to login if it is Inactive
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mt: 2, mb: 1, width: 1, justifyContent: 'space-between' }}
                />
              )}
            </Box>
            <Box>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="approver"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== true}
                        onChange={(event) => field.onChange(event.target.checked ? false : true)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Approver
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Allow user to approve the incidents.
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mt: 2, mb: 1, width: 1, justifyContent: 'space-between' }}
              />
            </Box>
            <Stack alignItems="flex-end" justifyContent="flex-end" sx={{ flexDirection: 'row', mt: 3 }}>
              <NextLink href={PATH_DASHBOARD.settings.users} passHref>
                <Button color="secondary" variant="contained" sx={{ mr: 1 }}>
                  Cancel
                </Button>
              </NextLink>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

async function fetchUser(id) {
  return await getUserById(id);
}
