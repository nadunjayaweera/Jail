import React, { useState, useEffect } from "react";
import { useCartCtx } from "../../../context/CartCtx";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import md5 from "crypto-js/md5";
const Form = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const [customerName, setCustomerName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const useremail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userLName = localStorage.getItem("userLName");
  const userMobile = localStorage.getItem("userMobile");

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

  console.log({ cartData });

  console.log("User Email Address", email);
  // Payment variables
  let merchantSecret = "OTQ0ODU0Nzc4MjUyMDU5MjI3MDQyNzg3MTIxMzI4MzM1NDY3OTQ=";
  let merchantId = "1223574";
  let orderId = "12345";
  let amount = totalPrice;
  let hashedSecret = md5(merchantSecret).toString().toUpperCase();
  let amountFormated = parseFloat(amount)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
    .replaceAll(",", "");
  let currency = "LKR";
  let hash = md5(
    merchantId + orderId + amountFormated + currency + hashedSecret
  )
    .toString()
    .toUpperCase();
  //alert(hash);
  var payment = {
    sandbox: true,
    //preapprove: true,
    merchant_id: "1223574",
    merchantSecret: "OTQ0ODU0Nzc4MjUyMDU5MjI3MDQyNzg3MTIxMzI4MzM1NDY3OTQ=",
    return_url: "http://sample.com/return",
    cancel_url: "http://sample.com/cancel",
    notify_url: "http://sample.com/notify",
    order_id: 12345,
    items: "Hoppers",
    amount: totalPrice,
    currency: "LKR",
    first_name: userName,
    last_name: userLName,
    email: useremail,
    phone: userMobile,
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka",
    delivery_address: "No. 46, Galle road, Kalutara South",
    delivery_city: "Kalutara",
    delivery_country: "Sri Lanka",
    hash: hash,
  };

  // Called when user completed the payment. It can be a successful payment or failure
  window.payhere.onCompleted = async function onCompleted(orderId) {
    console.log("Payment completed. OrderID:" + orderId);

    try {
      const addSaleResponse = await axios.post(
        "https://backfood.tfdatamaster.com/api/v1/addsale",
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

    //Note: validate the payment and show success or failure page to the customer
  };

  // Called when user closes the payment without completing
  window.payhere.onDismissed = function onDismissed() {
    //Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
  };

  // Called when an error happens when initializing payment such as invalid parameters
  window.payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
  };

  const apiData = {
    customerName: userName,
    products: products,
    totalPrice: totalPrice,
    productStatus: "pending",
    email: useremail,
  };

  const pay = async (event) => {
    window.payhere.startPayment(payment);
  };

  return <img onClick={pay} className="payherebtn" src="payhere.png" />;
};

export default Form;
