import React from "react";
import Typography from "@mui/material/Typography";

export default function ShoppingCart({ cart }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <Typography variant="h5">Shopping Cart</Typography>
      {cart.map((item) => (
        <div key={item.id}>
          <Typography>{item.name}</Typography>
          <Typography>Price: {item.price}</Typography>
          <hr />
        </div>
      ))}
    </div>
  );
}
