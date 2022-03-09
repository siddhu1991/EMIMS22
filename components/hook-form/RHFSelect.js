import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Box } from '@mui/material';
//components
import Label from '../InputLabel';
// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFSelect({ name, clabel, children, ...other }) {
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
            select
            fullWidth
            SelectProps={{ native: true }}
            error={!!error}
            helperText={error?.message}
            InputLabelProps={{ shrink: false }}
            {...other}
          >
            {children}
          </TextField>
        )}
      />
    </Box>
  );
}
