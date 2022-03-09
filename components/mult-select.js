import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import Iconify from '../components/Iconify';

export const MultiSelect = (props) => {
  const { label, onChange, options, value = [], ...other } = props;
  const anchorRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleChange = (event) => {
    let newValue = [...value];

    if (event.target.checked) {
      newValue.push(event.target.value);
    } else {
      newValue = newValue.filter((item) => item !== event.target.value);
    }

    onChange?.(newValue);
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
        PaperProps={{ style: { width: 250 } }}
      >
        {options.map((option) => (
          <MenuItem key={option.label}>
            <FormControlLabel
              control={<Checkbox checked={value.includes(option.value)} onChange={handleChange} value={option.value} />}
              label={option.label}
              sx={{
                flexGrow: 1,
                mr: 0,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
};
