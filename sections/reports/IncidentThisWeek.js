import merge from 'lodash/merge';
import { useState } from 'react';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import ReactApexChart, { BaseOptionChart } from '../../components/chart';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 2019,
    data: [
      { name: 'NG-feed', data: [10, 200, 100, 151, 49, 62, 69] },
      { name: 'Non-feed', data: [10, 34, 150, 56, 180, 190, 200] },
    ],
  },
  {
    year: 2020,
    data: [
      { name: 'NG-feed', data: [148, 91, 200, 62, 49, 51, 35] },
      { name: 'Non-feed', data: [45, 77, 99, 88, 77, 56, 13] },
    ],
  },
];

export default function IncidentThisWeek() {
  const [seriesData, setSeriesData] = useState(2019);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  });

  return (
    <Card>
      <CardHeader
        title="163"
        subheader="Incidents this week"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 },
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
