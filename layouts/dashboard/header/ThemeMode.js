import { useState } from 'react';
// @mui
import { Switch, FormControlLabel } from '@mui/material';

// hooks
import useSettings from '../../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function ThemeMode() {
  const { themeMode, onChangeMode } = useSettings();

  return (
    <FormControlLabel
      control={<Switch checked={themeMode == 'dark' ? true : false} onChange={onChangeMode} focusVisibleClassName=".Mui-focusVisible" disableRipple />}
      label="Dark Mode"
      sx={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginLeft: 0, px: 2, py: '6px', mr: 0 }}
    />
  );
}
