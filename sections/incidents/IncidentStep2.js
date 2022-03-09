import { useState } from 'react';
import { Box, Typography, Chip, Grid, Link } from '@mui/material';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { RHFSelect, RHFTextField, RHFDateTimePicker } from '../../components/hook-form';
import Label from '../../components/Label';
import Avatar from '../../components/Avatar';
import Iconify from '../../components/Iconify';

export default function IncidentStep2({ hospitals, wards, locations, setValue }) {
  const [hospital, setHospital] = useState();
  const [wardsList, setWardsList] = useState(wards);
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

  const handleDelete = (e) => {};

  return (
    <Box className="incident-basicinfo-root">
      <Typography variant="h5">Basic Information</Typography>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        {/* <RHFTextField
          name="patient_id"
          clabel="Patient"
          placeholder="Select Patient"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}

        <Box className="patient_info">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Avatar alt="Natacha" src="https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_1.jpg" />
            </Grid>
            <Grid item xs={8}>
              <p className="name">Rebecca Meitecovitch</p>
              <p className="id">ID: Ynsnjnsi3</p>
              <span className="gender">Female</span>
              <span className="dob">01.01.2001</span>
              <span className="other">Section 3</span>
            </Grid>
            <Grid item xs={1} className="section3">
              <Link className="view" href="#">
                View
              </Link>
            </Grid>
            <Grid item xs={1} className="section4">
              <Box className="remove">
                <Iconify icon={'ep:remove'} fontSize="20px" />
              </Box>
              <Box className="top_info">
                <Iconify
                  className="iconify-inline"
                  icon={'fluent:location-48-regular'}
                  fontSize="60px"
                  color="darkgrey"
                />
                <Avatar alt="Natacha" src="https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg" />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <RHFSelect name="incident_type" clabel="Incident Type" placeholder="Incident Type">
          <option value="">Select Type</option>
        </RHFSelect>

        <Box className="incident_type_info">
          <Label>
            <Iconify icon={'bi:info-circle'} />
            An NG Feed incident (nasogastric)
          </Label>
        </Box>

        <RHFSelect name="hospital" clabel="Hospital" placeholder="Select Hospital" onChange={reloadWards}>
          <option value="">Select Hospital</option>
          {hospitals.length > 0
            ? hospitals.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.hospital_name}
                </option>
              ))
            : ''}
        </RHFSelect>

        <RHFSelect name="ward" clabel="Ward" placeholder="Select Ward">
          <option value="">Select Ward</option>
          {wardsList.length > 0
            ? wardsList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.ward_name}
                </option>
              ))
            : ''}
        </RHFSelect>

        <RHFSelect name="location" clabel="Location" placeholder="Select Location">
          <option value="">Select Location</option>
          {locations.length > 0
            ? locations.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))
            : ''}
        </RHFSelect>

        <RHFTextField name="room_id" clabel="Room" placeholder="Room" />

        <RHFDateTimePicker placeholder="Date & Time" name="incident_date_time" clabel="Date & time of the incident" />

        <RHFTextField
          placeholder="Enter Duration"
          type="number"
          name="duration"
          clabel="Duration"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: '0', max: '10', step: '1' }}
        />

        {/* <RHFTextField
          name="staff"
          clabel="Staff Involved"
          placeholder="Staff Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}

        {/* <Box className="div_staff_users">
          <Chip label="Ricky Palem" deleteIcon={<CloseIcon />} onDelete={handleDelete} />
          <Chip label="Sam Toledo" deleteIcon={<CloseIcon />} onDelete={handleDelete} />
        </Box> */}
      </Box>
    </Box>
  );
}
