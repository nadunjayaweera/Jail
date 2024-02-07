import React, { useState } from 'react';
import OrderList from './myorderlist';
import Footer from '../../footer';
import Navbar from '../navbar';
import { createTheme, ThemeProvider } from '@mui/material';
import {useCartCtx} from "../../../context/CartCtx";
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

const MyOrders = () => {
  
  const {cartData, setCartDataHandler, incrementCartItem , decrementCartItem} = useCartCtx();
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
          <Navbar items={cartData}/>
          
          <OrderList />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MyOrders;