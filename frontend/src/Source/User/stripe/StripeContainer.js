import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "./CheckoutForm";

const PUBLIC_KEY = "pk_test_51M0jlKFPs5ZOrbgJgo1qvctMuYMn8vTxwD9vP56B0LBVHjdP9TfRo8qhe8KrV6sruDH8ODP5RZSggkNetkPXo63I00e8iewmjK";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = () => {
  const location = useLocation();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");
    // const quantity = queryParams.get("quantity");
    const id = queryParams.get("id");
    const amount = queryParams.get("price");

    const itemData = {
      name: name,
      // quantity: quantity,
      _id: id,
      amount: amount,
    };

    setItem(itemData);
  }, [location.search]);

  return (
    <Elements stripe={stripeTestPromise}>
      {item && <CheckoutForm item={item} />}
    </Elements>
  );
};

export default Stripe;
