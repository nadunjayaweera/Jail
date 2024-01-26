import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Modal, Box, Button } from "@mui/material";
import axios from "axios";

export default function ProductList() {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backfood.tfdatamaster.com/api/v1/data/items"
        );
        console.log("API Response:", response.data);

        const formattedProductData = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          promotionStatus: product.promotionStatus,
          image: product.image,
        }));

        console.log("Product Data:", formattedProductData);
        setProductData(formattedProductData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      setCart([...cart, selectedProduct]);
      handleCloseModal();
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {productData.map((product) => (
        <Card
          key={product.id}
          sx={{ maxWidth: 500, margin: 5 }}
          onClick={() => handleOpenModal(product)}
        >
          <CardActionArea style={{ width: 200, height: 300 }}>
            <CardMedia
              component="img"
              alt={product.name}
              height="140"
              src={`data:image/jpeg;base64,${product.image}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: {product.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">
            {selectedProduct && selectedProduct.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: {selectedProduct && selectedProduct.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedProduct && selectedProduct.description}
          </Typography>
          <Button onClick={handleCloseModal}>Close</Button>
          <br />
          <Button
            variant="contained"
            style={{
              marginRight: "10px",
              width: "200px",
              height: "40px",
              borderRadius: "10px",
            }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Box>
      </Modal>

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
    </div>
  );
}
