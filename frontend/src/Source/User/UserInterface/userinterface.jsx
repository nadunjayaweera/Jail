import React, { useState } from 'react';
import Items from './items';
import Footer from '../../footer';
import Navbar from '../navbar';
import { Link } from 'react-router-dom';
import {createTheme, ThemeProvider } from '@mui/material';
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

const UserInterface = () => {
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
          <Items/>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default UserInterface;
