import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useCartCtx } from "../../context/CartCtx";
import { Link } from "react-router-dom";

const Cart = ({ cartItems }) => {
  const { cartData, setCartDataHandler } = useCartCtx();
  console.log({ cartData });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "cart-popover" : undefined;

  return (
    <>
      <Link to="/cartpage">
        {" "}
        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={cartData} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>{" "}
      </Link>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCartClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          {/* Display the cart items */}
          {cartItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.title} secondary={item.description} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default Cart;
