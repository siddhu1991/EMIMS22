import { useRef, useState } from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, Menu, MenuItem, Box } from '@mui/material';
import Iconify from './Iconify';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { fTimestamp } from '../utils/formatTime';

const StyledMenuItem = styled('MenuItem')({
  display: 'flex',
  padding: '8px 16px',
});

export const DateRange = (props) => {
  const { label, onChange, options, ...other } = props;
  const [dateValue, setDateValue] = useState(props.value);
  const anchorRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleChange = (value) => {
    let startDate = null;
    let endDate = null;
    if (value[0] != null) {
      startDate = fTimestamp(value[0]);
    }
    if (value[1] != null) {
      endDate = fTimestamp(value[1]);
    }
    setDateValue([value[0], value[1]]);
    onChange?.([startDate, endDate]);
  };

  return (
    <>
      <Button
        color="inherit"
        endIcon={<Iconify icon={'bi:chevron-down'} />}
        onClick={handleOpenMenu}
        ref={anchorRef}
        sx={{
          border: 1,
          borderColor: 'divider',
          padding: '10px 17px 10px 18px',
          marginRight: '16px',
          fontSize: '14px',
          fontWeight: '500',
        }}
        {...other}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        onClose={handleCloseMenu}
        open={openMenu}
        PaperProps={{ style: { width: 'auto' } }}
      >
        <StyledMenuItem>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="Check-in"
              endText="Check-out"
              mask="__-__-____"
              inputFormat="dd-MM-yyyy"
              value={dateValue}
              onChange={handleChange}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </StyledMenuItem>
      </Menu>
    </>
  );
};

DateRange.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  //value: PropTypes.array.isRequired,
};
