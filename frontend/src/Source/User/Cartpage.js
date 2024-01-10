import React, { useState, useEffect } from "react";
import Footer from "./../footer";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider, Button } from "@mui/material";
import "./CheckoutPage.css";
import { useAuthUser } from "react-auth-kit";

import { useNavigate, useLocation } from "react-router-dom";
import { useCartCtx } from "../../context/CartCtx";
import FoodIcon from "./food.svg"; // Assuming you have an SVG file named food.svg
import axios from "axios";
const theme = createTheme({
  palette: {
    primary: {
      main: "#eeeeee",
    },
    background: {
      default: "#eeeeee",
    },
  },
});

const CheckoutPage = () => {
  const [response, setResponse] = useState("");
  const navigation = useNavigate();
  const location = useLocation();
  const [customerName, setCustomerName] = useState("Admin");
  const [paymentStatus, setPaymentStatus] = useState("");
  const {
    cartData,
    setCartDataHandler,
    incrementCartItem,
    decrementCartItem,
    resetCart,
  } = useCartCtx();
  const totalPrice = cartData.reduce(
    (total, product) => total + parseInt(product.price) * product.quantity,
    0
  );
  const products = cartData.map((product) => ({
    productName: product.name,
    quantity: product.quantity,
    price: product.price,
  }));
  const { authState } = useAuthUser();
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (authState && authState.email) {
      setEmail(authState.email);
    }
  }, [authState]);

  const auth = useAuthUser();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // If the new quantity is less than or equal to 0, remove the item from the cart
      setCartDataHandler((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } else {
      // Update the quantity of the item in the cart
      setCartDataHandler((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleQuantityIncrement = (itemId) => {
    setCartDataHandler((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleQuantityDecrement = (itemId) => {
    setCartDataHandler((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const calculateTotalPrice = () => {
    let totalPrice2 = 0;
    cartData.forEach((item) => {
      totalPrice2 += item.quantity * item.price;
    });
    return totalPrice2;
  };
  const totalPrice2 = cartData.reduce(
    (acc, product) => acc + parseFloat(product.price),
    0
  );

  const productQueryParams = cartData
    .map(
      (product, index) =>
        `name${index + 1}=${encodeURIComponent(product.name)}&id${index + 1}=${
          product.id
        }&price${index + 1}=${product.price}`
    )
    .join("&");

  const paymentUrl = `/payment?${productQueryParams}&totalPrice=${totalPrice2}`;

  const handleSendMessage = () => {
    const MSISDN = "94775553892";
    const MESSAGE = "Test";
    const USERNAME = "xxxxx";
    const PWD = "xxxxx";
    const SRC = "xxxxx";

    const url = "http://sms.textware.lk:5000/sms/send_sms.php";
    const myvars = `username=${encodeURIComponent(
      USERNAME
    )}&password=${encodeURIComponent(PWD)}&src=${encodeURIComponent(
      SRC
    )}&dst=${encodeURIComponent(MSISDN)}&msg=${encodeURIComponent(MESSAGE)}`;

    // Using fetch
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: myvars,
    })
      .then((response) => response.text())
      .then((data) => setResponse(data))
      .catch((error) => console.error("Error:", error));

    // If you chose to use axios, you can do the following:
    // axios.post(url, myvars)
    //   .then((response) => setResponse(response.data))
    //   .catch((error) => console.error('Error:', error));
  };
  const apiData = {
    customerName: customerName,
    products: products,
    totalPrice: totalPrice,
    productStatus: "pending",
    email: email,
  };
  const pay = async (event) => {
    try {
      const addSaleResponse = await axios.post(
        "http://localhost:8082/api/v1/addsale",
        apiData
      );

      if (addSaleResponse.data.success) {
        console.log("Sale added successfully");
        navigation("/userinterface");

        resetCart();
      } else {
        console.log("Failed to add sale");
      }
    } catch (error) {
      console.log("Error:", error);
      setPaymentStatus("Payment Failed!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundColor: "#e1e1e1",
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Navbar items={cartData} />

          <div className="contain">
            <h1>Checkout</h1>
            {cartData.map((item) => (
              <div key={item.id} className="item">
                <div className="item-info">
                  <img src={FoodIcon} alt="Food Icon" className="food-icon" />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="price">Price: Rs{item.price}</p>
                  </div>
                </div>
                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => decrementCartItem(item.name)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="quantity-input"
                    />
                    <button
                      className="quantity-button"
                      onClick={() => incrementCartItem(item.name)}
                    >
                      +
                    </button>
                  </div>
                  <p className="total">Total: Rs{item.quantity * item.price}</p>
                </div>
              </div>
            ))}
            <h3 className="total-price">
              Total Price: Rs{calculateTotalPrice()}
            </h3>
            {localStorage.getItem("userRole") !== "admin" ? (
              <Link to="/formpayment">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginTop: "10px",
                    color: "weight",
                    borderColor: "#00b300",
                    backgroundColor: "#00b300",
                  }} // Custom styles for color and border color
                >
                  Pay Now
                </Button>
              </Link>
            ) : (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: "10px",
                  color: "weight",
                  borderColor: "#00b300",
                  backgroundColor: "#00b300",
                }} // Custom styles for color and border color
                onClick={pay}
              >
                Pay Now
              </Button>
            )}
            {/* <Link to={`/payment?name=${encodeURIComponent(title)}&id=${_id}&price=${price}&index=${index+1}`}> */}
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default CheckoutPage;
