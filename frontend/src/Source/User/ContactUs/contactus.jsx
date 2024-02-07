import React from 'react';
import Navbar from '../navbar';
import ContactForm from './contactuscomponent';
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

const ContactUs = () => {
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
          <ContactForm />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default ContactUs;
