import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
// next
import { useRouter } from 'next/router';
import useSWR from 'swr';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import Avatar from '../../components/Avatar';
import TabPanel from '../../components/TabPanel';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar, RHFCheckbox, RHFDatePicker } from '../../components/hook-form';
// Models
//import { addIncident, getIncidentById, updateIncident } from '../../models/incidents';
// Utils
import { fDate } from '../../utils/formatTime';

import IncidentTabs from './IncidentTabs';
import IncidentStep1 from './IncidentStep1';
import IncidentStep2 from './IncidentStep2';
// ----------------------------------------------------------------------

IncidentNewForm.propTypes = {
  hospitals: PropTypes.array,
  wards: PropTypes.array,
  locations: PropTypes.array,
  isEdit: PropTypes.bool,
  currentIncident: PropTypes.object,
};

export default function IncidentNewForm({ hospitals, wards, locations, id, isEdit = false, currentIncident }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const incidentId = id;

  const [currentActiveTabIndex, setCurrentActiveTabIndex] = useState(0);
  const [tabStatus, setTabStatus] = useState(['inprogress', 'pending', 'pending', 'pending']);
  const [tabDisabled, setTabDisabled] = useState([false, true, true, true]);

  const handleChange = (event, newValue) => {
    setCurrentActiveTabIndex(newValue);
  };

  const NewIncidentSchema = Yup.object().shape({
    //name: Yup.string().required('Incident Name is required'),
  });

  const { data: incident, error } = useSWR(id, fetchIncident);
  if (incident) {
    currentIncident = incident.data[0];
    isEdit = true;
  }
  const defaultValues = useMemo(
    () => ({
      //name: currentIncident?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIncident]
  );

  const methods = useForm({
    resolver: yupResolver(NewIncidentSchema),
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
    if (isEdit && currentIncident) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentIncident]);

  const onSubmit = async (data) => {
    if (data) {

      if (isEdit) {
      	data.updated = fDate(Date.now());
        const updateIncidentMeta = await updateIncident(incidentId, data);

        if (!updateIncidentMeta.error) {
          enqueueSnackbar('Incident Updated Successfully');
          push(PATH_DASHBOARD.incidents.root);
        } else {
          enqueueSnackbar('Something Went Wrong, Please try again');
        }
	  } else {
      	data.created = fDate(Date.now());
      	data.updated = fDate(Date.now());

	    const addIncidentMeta = await addIncident(data);
	    if (!addIncidentMeta.error) {
	      reset();
	      enqueueSnackbar('Incident Created Successfully');
	      push(PATH_DASHBOARD.incidents.root);
	    } else {
	      enqueueSnackbar('Something Went Wrong, Please try again');
	    }
      }
    } else {
      enqueueSnackbar('Something Went Wrong, Please try again');
    }
  };


  const handleNextClick = () => {
    tabStatus[currentActiveTabIndex] = 'complete';
    tabStatus[currentActiveTabIndex + 1] = 'inprogress';
    tabDisabled[currentActiveTabIndex + 1] = false;
  	setCurrentActiveTabIndex(++currentActiveTabIndex);
  	setTabStatus(tabStatus);
    setTabDisabled(tabDisabled);
  };

  const handleBackClick = () => {
    tabStatus[currentActiveTabIndex] = 'pending';
    tabStatus[currentActiveTabIndex - 1] = 'inprogress';
  	setCurrentActiveTabIndex(--currentActiveTabIndex);
    setTabStatus(tabStatus);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <IncidentTabs currentActiveTabIndex={currentActiveTabIndex} tabDisabled={tabDisabled} tabStatus={tabStatus} handleChange={handleChange} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3
              }}
            >
            	<TabPanel className="incidents-step1" value={currentActiveTabIndex} index={0}>
    			        <div><IncidentStep1 /></div>
    			    </TabPanel>
    			    <TabPanel className="incidents-step2" value={currentActiveTabIndex} index={1}>
    			        <div><IncidentStep2 hospitals={hospitals} wards={wards} locations={locations} setValue={setValue} /></div>
    			    </TabPanel>
    			    <TabPanel className="incidents-step3" value={currentActiveTabIndex} index={2}>
    			        Item Three
    			    </TabPanel>
    			    <TabPanel className="incidents-step4" value={currentActiveTabIndex} index={3}>
    			        Item Four
    			    </TabPanel>
            </Box>

            <Stack className="form-actions incident-actions" direction="row" spacing={2} alignItems="flex-end" sx={{ mt: 3 }}>

              {currentActiveTabIndex > 0 ?
              (<LoadingButton type="button" className="back-button" variant="contained" onClick={handleBackClick} loading={isSubmitting}>
                Back
              </LoadingButton>) : null}

              {currentActiveTabIndex < 3 ?
              (<LoadingButton type="button" className="next-button" variant="contained" onClick={handleNextClick} loading={isSubmitting}>
                Next
              </LoadingButton>) : null}

              {currentActiveTabIndex === 3 ?
              (<LoadingButton type="submit" className="save-button" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Submit' : 'Save Changes'}
              </LoadingButton>) : null}

            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

async function fetchIncident(id) {
  //return await getIncidentById(id);
  return;
}