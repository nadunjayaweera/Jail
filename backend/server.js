import express from "express";
import cors from "cors";
import signup from "./api/signup.route.mjs";
import presonersignup from "./api/prisoners/presonersignup.route.mjs";
import login from "./api/login.route.mjs"; // import the login route
import getUsers from "./api/users.route.mjs";
import additem from "./api/additem.route.mjs"; // import the additem route
import addrowitem from "./api/rowitem/addrowitem.route.mjs"; // import the addrowitem route
import addMenu from "./api/addmenu/addmenu.route.mjs"; // import the addmenu route
import stock from "./api/stock/stock.route.mjs"; // import the stock route
import updateitem from "./api/additem.route.mjs"; // import the additem route
import deleteitem from "./api/additem.route.mjs"; // import the additem route
import dataRoute from "./api/data.route.mjs"; // add import from data route.
import getData from "./api/data.route.mjs";
import getItem from "./api/data.route.mjs";
import updateItemQuantity from "./api/data.route.mjs";
import stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import addSale from "./api/data.route.mjs";
import getSale from "./api/data.route.mjs";
import updateOrderStatus from "./api/data.route.mjs";
dotenv.config();
const stripeSecretTest = process.env.STRIPE_SECRET_TEST;
const stripeInstance = stripe(stripeSecretTest);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());
app.use(express.json());

app.post("/stripe/charge", async (req, res) => {
  console.log("stripe-routes.js 9 | route reached", req.body);
  const { amount, id, name, quantity, productId, price } = req.body;
  console.log(
    "stripe-routes.js 10 | amount, id, name, quantity, productId, price",
    amount,
    id,
    name,
    quantity,
    productId,
    price
  );
  try {
    const payment = await stripeInstance.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
      paymentMethod: payment,
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});

app.use("/api/v1/membersignup", signup);
app.use("/api/v1/presonersignup", presonersignup);
app.use("/api/v1/login", login); // add the login route
app.use("/api/v1/users", getUsers); // add the users route
app.use("/api/v1/", additem); // add the additem route
app.use("/api/v1/", addrowitem); // add row item route
app.use("/api/v1/", stock);
app.use("/api/v1/", addMenu); // add menu item route
app.use("/api/v1/data", dataRoute); // add the data route
app.use("/api/v1/data", getData); // add the data route
app.use("/api/v1/data", getItem); // add the data route
app.use("/api/v1/", updateItemQuantity); // add the data route
app.use("/api/v1/", updateOrderStatus); // add the data route
app.use("/api/v1/", addSale); // add the data route
app.use("/api/v1/", getSale); // add the data route
app.use("/api/v1/", updateitem); // add the data route
app.use("/api/v1/", deleteitem); // add the data route

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
