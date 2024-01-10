import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import Cart from "../Cart";
import { Link } from "react-router-dom";
import { useCartCtx } from "../../../context/CartCtx";
import LoadingSpinner from "../LoadingSpinner";

const ItemCard = ({
  imageSrc,
  title,
  price,
  promotionStatus,
  addToCart,
  itemdescription,
}) => {
  const formattedPrice = `Rs. ${price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "10px",
        backgroundColor: "#808080",
      }}
    >
      <CardMedia
        component="img"
        src={`data:image/jpeg;base64,${imageSrc}`} // Pass the base64-encoded image directly
        alt={title}
        sx={{
          width: 100,
          height: 100,
          objectFit: "cover",
          marginLeft: "10px",
        }}
      />
      <CardContent>
        <Typography variant="h6" sx={{ color: "white" }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "white" }}>
          {formattedPrice}
        </Typography>
        <Typography variant="body2" sx={{ color: "#B6B6B4" }}>
          {itemdescription}
        </Typography>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={addToCart}
          sx={{
            marginTop: "10px",
            color: "weight",
            borderColor: "#00b300",
            backgroundColor: "#00b300",
          }} // Custom styles for color and border color
        >
          Add to cart
        </Button>
      </CardContent>
    </Card>
  );
};

const Items = () => {
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { cartData, setCartDataHandler } = useCartCtx();

  useEffect(() => {
    setIsLoading(true);
    fetch("https://backfood.tfdatamaster.com/api/v1/data/items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    setCartDataHandler(item);
  };

  const filteredItems = items.filter(
    (item, index) => item.promotionStatus === "promoted"
  );
  return (
    <>
      {isLoading ? (
        <LoadingSpinner /> // Show the LoadingSpinner when isLoading is true
      ) : (
        <Grid container spacing={2}>
          {filteredItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ItemCard
                index={index}
                _id={item._id}
                imageSrc={item.image}
                title={item.name}
                price={item.price}
                promotionStatus={item.promotionStatus}
                itemdescription={item.description}
                addToCart={() => addToCart(item)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {cartItems.length > 0 && <Cart cartItems={cartItems} />}
    </>
  );
};

export default Items;
