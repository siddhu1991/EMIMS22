import { Box, Typography } from '@mui/material';
import { RHFRadioGroup } from '../../components/hook-form';

export default function IncidentStep1() {
  const categoryOptions = ['NG Feeding', 'General Incident', 'Noo-patient Incident'];
  const categoryOptionsValues = ['ng-feeding', 'general', 'noo-patient'];
  return (
    <Box className="incident-category-root">
      <Typography variant="h5">Select Incident Category</Typography>
      <RHFRadioGroup
        className="incident-category"
        name="incident_category"
        options={categoryOptions}
        defaultValue=""
        values={categoryOptionsValues}
        ids={categoryOptionsValues}
      />
    </Box>
  );
}
