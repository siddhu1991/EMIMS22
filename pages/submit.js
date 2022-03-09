import React from "react";
import { Box, Grid, FormControl, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";

export default function Auth() {
  return (
    <Box component="form" autoComplete="off">
      <FormControl>
        <Paper style={{ padding: 16 }}>
          <Grid xs={12}>
            <TextField id="standard-basic" label="name" variant="standard" focused />
          </Grid>
          <Grid xs={12}>
            <TextField
              id="standard-basic-1"
              label="surname"
              variant="standard"
            />
          </Grid>
        </Paper>
      </FormControl>
    </Box>
  );
}
