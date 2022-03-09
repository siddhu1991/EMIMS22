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
import { Box, Card, Grid, Stack, Switch, Button, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import Avatar from '../../components/Avatar';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar, RHFDatePicker } from '../../components/hook-form';
// Models
import { addPatient, getPatientById, updatePatient } from '../../models/patients';
// Utils
import { fDate } from '../../utils/formatTime';
// ----------------------------------------------------------------------

PatientNewForm.propTypes = {
  hospitals: PropTypes.array,
  wards: PropTypes.array,
  isEdit: PropTypes.bool,
  currentPatient: PropTypes.object,
};

export default function PatientNewForm({ hospitals, wards, roles, id, isEdit = false, currentPatient }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [hospital, setHospital] = useState();
  const [wardsList, setWardsList] = useState(wards);
  const patientId = id;

  const NewPatientSchema = Yup.object().shape({
    name: Yup.string().required('Patient Name is required'),
    patient_code: Yup.string().required('Patient Code is required'),
    gender: Yup.string().required('Gender is required'),
    hospital: Yup.number().required('Hospital is required'),
    ward: Yup.number().required('Ward is required'),
  });

  const { data: patient, error } = useSWR(id, fetchPatient);
  if (patient) {
    currentPatient = patient.data[0];
    isEdit = true;
  }
  const defaultValues = useMemo(
    () => ({
      name: currentPatient?.name || '',
      gender: currentPatient?.gender || '',
      status: currentPatient?.status,
      hospital: currentPatient?.hospital_id || '',
      ward: currentPatient?.ward_id || '',
      patient_code: currentPatient?.patient_code || '',
      risk_level: currentPatient?.risk_level || '',
      dob: currentPatient?.dob || '',
      room_id: currentPatient?.room_id || '',
      avatar: currentPatient?.avatar || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPatient]
  );

  const methods = useForm({
    resolver: yupResolver(NewPatientSchema),
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
    if (isEdit && currentPatient) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPatient]);

  const onSubmit = async (data) => {
    if (data) {
      if (isEdit) {
        data.updated = fDate(Date.now());
        const updatePatientMeta = await updatePatient(patientId, data);

        if (!updatePatientMeta.error) {
          enqueueSnackbar('Patient Updated Successfully');
          push(PATH_DASHBOARD.patients.root);
        } else {
          enqueueSnackbar('Something Went Wrong, Please try again');
        }
      } else {
        data.status = true;
        data.created = fDate(Date.now());
        data.updated = fDate(Date.now());

        const addPatientMeta = await addPatient(data);
        if (!addPatientMeta.error) {
          reset();
          enqueueSnackbar('Patient Created Successfully');
          push(PATH_DASHBOARD.patients.root);
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
          'avatar',
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
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ flexGrow: 1, mb: 4 }}>
              <Typography variant="h4">Patient information</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" clabel="Name" />
              <RHFTextField name="patient_code" clabel="Patient Code" />
              <RHFSelect name="gender" clabel="Gender" placeholder="Select Gender">
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </RHFSelect>
              <RHFDatePicker name="dob" clabel="Date of Birth" />
              <RHFTextField name="room_id" clabel="Room ID" />
              <RHFTextField name="risk_level" clabel="Risk Level" />
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
            </Box>

            <Box>
              <Grid container spacing={2} sx={{ py: 3 }}>
                <Grid item xs={12}>
                  <Box xs={12} md={8} sx={{ mb: 1 }}>
                    <RHFUploadAvatar
                      name="avatar"
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
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
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Stack alignItems="flex-end" justifyContent="flex-end" sx={{ flexDirection: 'row', mt: 3 }}>
              <NextLink href={PATH_DASHBOARD.patients.root} passHref>
                <Button color="secondary" variant="contained" sx={{ mr: 1 }}>
                  Cancel
                </Button>
              </NextLink>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Patient' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

async function fetchPatient(id) {
  return await getPatientById(id);
}
