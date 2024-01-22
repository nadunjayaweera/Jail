import React, { useState, useEffect } from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OrderDetailsDialog from "./OrderDetailsDialog";
import PrintIcon from "@mui/icons-material/Print";
import OrdersDetails from "./OrdersDetails";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default function ProductList() {
  const [editRowsModel, setEditRowsModel] = React.useState({});
  const [salesData, setSalesData] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState([]); // Initialize as an empty array
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialog2, setOpenDialog2] = React.useState(false);

  React.useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8084/api/v1/getsales"
        );
        const salesData = response.data;
        const currentDate = new Date().toISOString().split("T")[0];
        salesData.sort((a, b) => new Date(b.orderId) - new Date(a.orderId));
        const todayOrders = salesData.filter(
          (product) => product.timestamp.split("T")[0] === currentDate
        );
        const formattedSalesData = salesData.map((product, index) => ({
          id: index + 1,
          feeldid: product._id,
          pid: product.id,
          name: product.customerName,
          products: product.products,
          price: product.totalPrice,
          time: product.timestamp,
          email: product.email,
          orders: product.productName,
          orderid: product.orderId,
          // quantity: product.orders.length,
          orderstatus: product.productStatus,
        }));

        console.log("Sales Data:", formattedSalesData);
        setSalesData(formattedSalesData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "price",
      headerName: "Price (Rs.)",
      type: "number",
      width: 120,
    },
    {
      field: "orderid",
      headerName: "Order ID",
      type: "number",
      width: 120,
    },
    {
      field: "orderstatus",
      headerName: "Order Status",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            fontWeight: "bold",
            color: getStatusColor(params.value),
          }}
        >
          {params.value}
        </span>
      ),
    },

    {
      field: "orders",
      headerName: "Options",
      width: 200,
      renderCell: (params) => (
        <React.Fragment>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleViewOrders(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleViewOrders2(params.row)}
          >
            <PrintIcon />
          </IconButton>
        </React.Fragment>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <IconButton
          color="primary"
          size="small"
          onClick={() =>
            handleUpdateStatus(params.row.feeldid, params.row.orderstatus)
          }
        >
          Update
        </IconButton>
      ),
    },
  ];

  const handlePrint = (orderid, orders) => {
    console.log("Printing Order ID:", orderid);
    console.log("Printing Orders:", orders);

    window.print();
  };

  const getStatusColor = (orderstatus) => {
    switch (orderstatus) {
      case "pending":
        return "#FF9800"; // Orange for Pending
      case "Processing":
        return "#2196F3"; // Blue for Processing
      case "Done":
        return "#4CAF50"; // Green for Done
      case "Delivered":
        return "#9C27B0"; // Purple for Delivered
      default:
        return "";
    }
  };

  const handleViewOrders = (row) => {
    setSelectedOrder([row]);
    setOpenDialog(true);
  };
  const handleViewOrders2 = (row) => {
    setSelectedOrder([row]);
    setOpenDialog2(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (feeldid) => {
    try {
      // Make an API request to update the order status
      await axios.put(
        `http://localhost:8084/api/v1/${feeldid}/update-data`,
        {}
      );

      // Fetch the updated sales data
      const response = await axios.get("http://localhost:8084/api/v1/getsales");
      const updatedSalesData = response.data.map((product, index) => ({
        id: index + 1,
        feeldid: product._id,
        pid: product.id,
        name: product.customerName,
        products: product.products,
        price: product.totalPrice,
        time: product.timestamp,
        email: product.email,
        orders: product.productName,
        orderid: product.orderId,
        // quantity: product.orders.length,
        orderstatus: product.productStatus,
      }));

      // Update the sales data state with the updated data
      setSalesData(updatedSalesData);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <StripedDataGrid
        rows={salesData}
        columns={columns}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={(newModel) => setEditRowsModel(newModel)}
      />
      <OrderDetailsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        orders={selectedOrder}
      />
      <OrdersDetails
        open={openDialog2}
        onClose={handleCloseDialog2}
        orders={selectedOrder}
      />
    </div>
  );
}
