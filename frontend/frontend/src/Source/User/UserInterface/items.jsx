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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ItemCard = ({
  imageSrc,
  title,
  price,
  promotionStatus,
  addToCart,
  _id,
  index,
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
  const { cartData, setCartDataHandler } = useCartCtx();
  const [pageNumber, setPageNumber] = useState(1); // Track the current page number
  const itemsPerPage = 9; // Number of items to show per page

  useEffect(() => {
    setIsLoading(true);
    fetchItems(pageNumber); // Fetch items for the initial page
  }, [pageNumber]);

  const addToCart = (item) => {
    setCartDataHandler(item);
  };

  const filteredItems = items.filter(
    (item) => item.promotionStatus === "notPromoted"
  );

  const fetchItems = (page) => {
    setIsLoading(true);
    const url = `http://localhost:8084/api/v1/itempart?pageNumber=${page}&itemsPerPage=${itemsPerPage}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  const handleNextPage = () => {
    // Increment the page number and fetch the next page of items
    setPageNumber(pageNumber + 1);
  };

  const handlePrevPage = () => {
    // Decrement the page number and fetch the previous page of items
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <>
      <div>
        <Button
          variant="contained"
          color="primary" // You can change the color to your preference
          size="small"
          onClick={handlePrevPage}
          disabled={pageNumber === 1}
          startIcon={<ArrowBackIcon />} // Add the arrow icon for Previous
        >
          Prev
        </Button>

        <Button
          variant="contained"
          color="primary" // You can change the color to your preference
          size="small"
          onClick={handleNextPage}
          startIcon={<ArrowForwardIcon />} // Add the arrow icon for Next
        >
          Next
        </Button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Grid container spacing={2}>
            {filteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <ItemCard
                  index={index}
                  _id={item._id}
                  imageSrc={item.image}
                  title={item.name}
                  itemdescription={item.description}
                  price={item.price}
                  promotionStatus={item.promotionStatus}
                  addToCart={() => addToCart(item)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {cartItems.length > 0 && <Cart cartItems={cartItems} />}
    </>
  );
};

export default Items;
