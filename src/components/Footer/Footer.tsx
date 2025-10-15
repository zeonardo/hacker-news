import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      width: '100%',
      bgcolor: '#000',
      color: '#fff',
      py: 2,
      px: 3,
      position: 'fixed',
      bottom: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      zIndex: 1300,
    }}
    data-testid="footer"
  >
    <Typography variant="body2" align="right" sx={{ width: '100%' }}>
      © {new Date().getFullYear()} Hacker News. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
