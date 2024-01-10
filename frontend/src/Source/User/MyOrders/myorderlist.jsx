import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await fetch(
          `https://backfood.tfdatamaster.com/api/v1/getuserorders/${email}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Mapping data:", data);
          setOrders(data);
        } else {
          console.error("Failed to fetch orders:", response.status);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Grid container spacing={2}>
      {orders.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h6">You have no Orders</Typography>
        </Grid>
      ) : (
        orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "10px",
                backgroundColor: "#808080",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "white" }}>
                  {order.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Order ID: {order.orderId}
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Order Status: {order.productStatus}
                </Typography>
                {/* <Typography variant="body2" sx={{ color: 'white' }} > 
                {order.productName} ({order.productPrice})
              </Typography> */}
                <table style={{ width: "100%" }}>
                  <thead>
                    <th style={{ color: "white" }}>#</th>
                    <th style={{ color: "white" }}>Item</th>
                    <th style={{ color: "white" }}>Qty</th>
                  </thead>
                  <tbody>
                    {order &&
                      order.products.map((item, index) => (
                        <tr>
                          <td
                            style={{
                              color: "white",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td>
                            <span
                              style={{
                                color: "white",
                              }}
                            >
                              {item.productName}
                            </span>
                          </td>
                          <td
                            style={{
                              color: "white",
                            }}
                          >
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Total Price: Rs.{order.totalPrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default OrderList;
