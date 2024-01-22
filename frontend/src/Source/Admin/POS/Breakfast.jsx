// ItemCard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Modal,
  Box,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

export default function ItemCard({ addToCart }) {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [dateCheckboxes, setDateCheckboxes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backprison.talentfort.live/api/v1/data/itemscategoryvice?category=Breakfast"
        );
        const formattedProductData = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
        }));
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
    if (selectedProduct && selectedDate) {
      addToCart({ product: selectedProduct, date: selectedDate });
      handleCloseModal();
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const renderDateCheckboxes = () => {
    const currentDate = new Date();
    const checkboxes = [];
    for (let i = 0; i < 3; i++) {
      const checkboxDate = new Date();
      checkboxDate.setDate(currentDate.getDate() + i);
      const formattedDate = `${checkboxDate.getDate()} ${checkboxDate.toLocaleString(
        "default",
        {
          month: "short",
        }
      )}`;
      checkboxes.push(
        <FormGroup key={i}>
          <FormControlLabel
            control={<Checkbox />}
            label={`${formattedDate}`}
            onClick={() => handleDateSelection(checkboxDate)}
          />
        </FormGroup>
      );
    }
    setDateCheckboxes(checkboxes);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  // Render date checkboxes when modal is opened
  useEffect(() => {
    if (modalOpen) {
      renderDateCheckboxes();
    }
  }, [modalOpen]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {productData.map((product) => (
        <Card
          key={product.id}
          sx={{ maxWidth: 500, margin: 2 }}
          onClick={() => handleOpenModal(product)}
        >
          <CardActionArea style={{ width: 200, height: 200 }}>
            <CardMedia
              component="img"
              alt={product.name}
              height="120"
              src={`data:image/jpeg;base64,${product.image}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h7" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: {product.price}
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
            bgcolor: "background.paper",
            transform: "translate(-50%, -50%)",
            width: 1200,
            height: 600,
            boxShadow: 24,
            p: 4,
            minHeight: 200,
          }}
        >
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="action tabs example"
            >
              <Tab label="staff" />
              <Tab label="Prison " />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis="x"
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir="ltr">
              {dateCheckboxes.map((checkbox, index) => (
                <div key={index}>{checkbox}</div>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1} dir="ltr"></TabPanel>
          </SwipeableViews>
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
    </div>
  );
}
