import React from 'react';
import Navbar from '../navbar';
import AboutUsdata from './aboutuscomponent';
import Footer from '../../footer';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#eeeeee',
    },
    background: {
      default: '#eeeeee',
    },
  },
});

const AboutUs = () => {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundColor: '#e1e1e1',
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Navbar />
          <AboutUsdata />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AboutUs;
