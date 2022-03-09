import { useState, useMemo, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
// @MUI
import { Box, Chip } from '@mui/material';
// Hooks
import { IncidentsFilterContext } from '../../contexts/IncidentsFilterContext';
// Components
import { MultiSelect } from '../mult-select';
import { DateRange } from '../date-range';
import Iconify from '../Iconify';
// Models
import { getHospitalNames } from '../../models/hospitals';
import { getWards } from '../../models/wards';
// Utils
import { fDate } from '../../utils/formatTime';

export const IncidentsFilters = () => {
  const [filters, setFilters] = useContext(IncidentsFilterContext);
  const [hospitals, setHospitals] = useState([]);
  const [wards, setWards] = useState([]);

  const getHospitals = async () => {
    const result = await loadHospitals();
    setHospitals(result);
  };
  const getWards = async () => {
    const result = await loadWards();
    setWards(result);
  };
  useEffect(() => {
    getHospitals();
    getWards();
  }, []);

  // ----------------------------------------------------------------------
  const StatusOptions = [
    {
      label: 'Active',
      value: '1',
    },
    {
      label: 'Inactive',
      value: '0',
    },
  ];
  const HospitalOptions = hospitals;
  const WardOptions = wards;
  const GenderOptions = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Female',
      value: 'female',
    },
  ];

  // ----------------------------------------------------------------------
  const handleDateChange = (value) => {
    // We only allow one chip for the name field
    const filterItem = filters.find((filterItem) => filterItem.field === 'date');
    console.log(filterItem);
    if (filterItem) {
      setFilters((prevState) =>
        prevState.map((filterItem) => {
          if (filterItem.field === 'date') {
            return {
              ...filterItem,
              value: value,
            };
          }
          return filterItem;
        })
      );
    } else {
      setFilters((prevState) => [
        ...prevState,
        {
          label: 'Date',
          field: 'date',
          value: value,
        },
      ]);
    }
  };

  const handleStatusChange = (values) => {
    setFilters((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== 'status') {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = StatusOptions.find((option) => option.value === value);
          newFilterItems.push({
            label: 'Status',
            field: 'status',
            value,
            displayValue: option.label,
          });
        }
      });
      return newFilterItems;
    });
  };

  const handleHospitalChange = (values) => {
    setFilters((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== 'hospital') {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = HospitalOptions.find((option) => option.value === value);
          newFilterItems.push({
            label: 'Hospital',
            field: 'hospital',
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handleWardChange = (values) => {
    setFilters((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== 'ward') {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = WardOptions.find((option) => option.value === value);
          newFilterItems.push({
            label: 'Ward',
            field: 'ward',
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handleGenderChange = (values) => {
    setFilters((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== 'gender') {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = GenderOptions.find((option) => option.value === value);
          newFilterItems.push({
            label: 'Gender',
            field: 'gender',
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handleDelete = (filterItem) => {
    setFilters((prevState) =>
      prevState.filter((_filterItem) => {
        return !(filterItem.field === _filterItem.field && filterItem.value === _filterItem.value);
      })
    );
  };

  // We memoize this part to prevent re-render issues
  const dateValue = [null, null];
  const StatusValues = useMemo(
    () => filters.filter((filterItems) => filterItems.field === 'status').map((filterItems) => filterItems.value),
    [filters]
  );

  const HospitalValues = useMemo(
    () => filters.filter((filterItems) => filterItems.field === 'hospital').map((filterItems) => filterItems.value),
    [filters]
  );

  const WardValues = useMemo(
    () => filters.filter((filterItems) => filterItems.field === 'ward').map((filterItems) => filterItems.value),
    [filters]
  );

  const GenderValues = useMemo(
    () => filters.filter((filterItems) => filterItems.field === 'gender').map((filterItems) => filterItems.value),
    [filters]
  );
  // ----------------------------------------------------------------------
  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <DateRange label="date" onChange={handleDateChange} value={dateValue} />

        <MultiSelect label="Status" onChange={handleStatusChange} options={StatusOptions} value={StatusValues} />

        {hospitals && (
          <MultiSelect
            label="Hospital"
            onChange={handleHospitalChange}
            options={HospitalOptions}
            value={HospitalValues}
          />
        )}
        {wards && <MultiSelect label="Ward" onChange={handleWardChange} options={WardOptions} value={WardValues} />}
        <MultiSelect label="Gender" onChange={handleGenderChange} options={GenderOptions} value={GenderValues} />
      </Box>
      <Box sx={{ mb: 3 }}>
        {filters.length > 0 ? (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              py: 2,
            }}
          >
            {filters.map((filterItem, i) => (
              <Chip
                key={i}
                label={
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      '& span': {
                        fontWeight: 600,
                      },
                    }}
                  >
                    <span>{filterItem.label}</span>:{' '}
                    {filterItem.label == 'Date'
                      ? fDate(filterItem.value[0]) + ' - ' + fDate(filterItem.value[1])
                      : filterItem.displayValue}
                  </Box>
                }
                deleteIcon={<Iconify icon={'heroicons-outline:x'} sx={{ width: 14, height: 14 }} />}
                onDelete={() => handleDelete(filterItem)}
                sx={{ my: 1, mr: 2 }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 3 }}></Box>
        )}
      </Box>
    </div>
  );
};

IncidentsFilters.propTypes = {
  onChange: PropTypes.func,
};

async function loadHospitals() {
  const { data: hospitals } = await getHospitalNames();
  let hospitalList = [];
  if (hospitals) {
    hospitals.forEach((hospital) => {
      hospitalList.push({
        label: hospital.hospital_name,
        value: String(hospital.id),
      });
    });
  }

  return hospitalList;
}

async function loadWards() {
  const { data: wards } = await getWards();
  let wardsList = [];
  if (wards) {
    wards.forEach((ward) => {
      wardsList.push({
        label: ward.ward_name,
        value: String(ward.id),
      });
    });
  }

  return wardsList;
}
