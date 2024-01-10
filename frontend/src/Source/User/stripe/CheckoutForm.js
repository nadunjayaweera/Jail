import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useCartCtx } from "../../../context/CartCtx";
export const CheckoutForm = ({ item }) => {
  const navigation = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const price = item.amount;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const index = queryParams.get("index");
  console.log(index);
  const [customerName, setCustomerName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { cartData, setCartDataHandler, incrementCartItem, decrementCartItem } =
    useCartCtx();
  const { authState } = useAuthUser();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (authState && authState.email) {
      setEmail(authState.email);
    }
  }, [authState]);

  const auth = useAuthUser();

  console.log("User Email Address", email);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post(
          "https://backfood.tfdatamaster.com/stripe/charge",
          {
            amount: price,
            id: id,
            name: item.name,
            quantity: item.quantity,
            productId: item._id,
            price: item.price,
          }
        );

        if (response.data.success) {
          console.log("Payment successful!");
          setPaymentStatus("Payment Successful!");

          const addSaleResponse = await axios.post(
            "https://backfood.tfdatamaster.com/api/v1/addsale",
            {
              customerName: customerName,
              productName: item.name,
              productPrice: item.amount,
              productStatus: "pending",
              email: "malakaaruna@gmail.com",
            }
          );

          if (addSaleResponse.data.success) {
            console.log("Sale added successfully");
            navigation("/userinterface");
          } else {
            console.log("Failed to add sale");
          }
        }
      } catch (error) {
        console.log("Error:", error);
        setPaymentStatus("Payment Failed!");
      }
    } else {
      console.log(error.message);
      setPaymentStatus("Payment Failed!");
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <form
      className="cf"
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      <div>{paymentStatus && <h4>{paymentStatus}</h4>}</div>
      <div>
        {console.log("new" + cartData)}
        <h4>Item Name: {item.name}</h4>
        <h4>Item Price: ${item.amount}</h4>
      </div>
      <div>
        <label htmlFor="customerName">Customer Name:</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <CardElement options={cardElementOptions} />
      <button type="submit">Pay</button>
    </form>
  );
};
