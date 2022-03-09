import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Box } from '@mui/material';
//components
import Label from '../InputLabel';

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({ name, clabel, ...other }) {
  const { control } = useFormContext();

  return (
    <Box>
      {clabel ? <Label>{clabel}</Label> : ''}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            error={!!error}
            helperText={error?.message}
            InputLabelProps={{ shrink: false }}
            {...other}
          />
        )}
      />
    </Box>
  );
}
