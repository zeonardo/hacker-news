import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const Header: React.FC = () => (
  <AppBar position="sticky" color="default" elevation={2} sx={{ backgroundColor: '#222728' }}>
    <Toolbar>
      <Box display="flex" alignItems="center" gap={1}>
        <NewspaperIcon color="primary" fontSize="large" />
        <Typography variant="h6" component="h1" color="white">
          Hacker News
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
