import React, { useState } from 'react';
import PromoItems from './promoitems';
import Footer from '../../footer';
import Navbar from '../navbar';
import { createTheme, ThemeProvider } from '@mui/material';
import { useCartCtx } from "../../../context/CartCtx";

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

const PromoInterface = () => {
  const {cartData, setCartDataHandler} = useCartCtx();
  console.log(cartData, setCartDataHandler);
  const [items, setItems] = useState([
    // Your initial items state or empty array
  ]);

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
          <Navbar items={cartData} />
          <PromoItems />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default PromoInterface;