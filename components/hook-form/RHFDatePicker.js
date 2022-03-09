import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Box } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
//components
import Label from '../InputLabel';
// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
  name: PropTypes.string,
};

export default function RHFDatePicker({ name, clabel, ...other }) {
  const { control } = useFormContext();

  return (
    <Box>
      {clabel ? <Label>{clabel}</Label> : ''}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            {...other}
            renderInput={(params) => <TextField {...params} fullWidth error={!!error} helperText={error?.message} />}
          />
        )}
      />
    </Box>
  );
}
