// ShoppingCart.jsx
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function ShoppingCart({ cart, removeFromCart }) {
  return (
    <div>
      {cart.map((item, index) => ( 
        <div key={item.product.id}>
          <Card
            sx={{
              display: "flex",
              width: 400,
              height: 150,
            }}
          >
            <CardMedia
              component="img"
              alt={item.product.name}
              height="100"
              src={`data:image/jpeg;base64,${item.product.image}`}
              sx={{
                width: 200,
                height: 100,
                flexShrink: 0,
              }}
            />
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography gutterBottom variant="h6" component="div">
                  {item.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {item.product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {item.date.toDateString()}{" "}
                  {/* Adjust this line to display the date in the desired format */}
                </Typography>
              </div>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeFromCart(index)} // Pass the index directly
                sx={{
                  width: "100px", // Adjust the width as needed
                  height: "30px", // Adjust the height as needed
                }}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
          <hr />
        </div>
      ))}
    </div>
  );
}
