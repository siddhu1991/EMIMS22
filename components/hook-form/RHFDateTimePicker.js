import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Box } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
//components
import Label from '../InputLabel';
// ----------------------------------------------------------------------

RHFDateTimePicker.propTypes = {
  name: PropTypes.string,
};

export default function RHFDateTimePicker({ name, clabel, className, ...other }) {
  const { control } = useFormContext();

  return (
    <Box className={'div_' + name}>
      {clabel ? <Label>{clabel}</Label> : ''}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            {...field}
            {...other}
            renderInput={(params) => <TextField {...params} fullWidth error={!!error} helperText={error?.message} />}
          />
        )}
      />
    </Box>
  );
}
