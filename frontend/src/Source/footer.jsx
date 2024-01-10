import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { Phone, LocationOn, Mail } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#eeeeee',
        color: 'black',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Phone />
          <Typography variant="body2">Contact NO: 011  2 87 14 14</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationOn />
          <Typography variant="body2">
            Address: No.15, Madiwela Road, Thalawathugoda, Sri Lanka.,
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Mail />
          <Typography variant="body2">Email: test@example.com</Typography>
        </Stack>
      </Stack>
      <Typography variant="body2" sx={{ marginTop: '10px' }}>
        © 2023 MEXICAN HOPPERS. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
