import React, { useState, useEffect } from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OrderDetailsDialog from "./OrderDetailsDialog";
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
  const [selectedMeal, setSelectedMeal] = React.useState("Breakfast"); // Default meal type

  const handleMealChange = (event) => {
    const newMeal = event.target.value;
    console.log("Selected Meal:", newMeal);
    setSelectedMeal(newMeal);
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8084/api/v1/data/getorders?meal=${selectedMeal}`
        );
        console.log("Response:", response);
        const salesData = response.data;
        salesData.sort((a, b) => new Date(b.kotId) - new Date(a.kotId));

        const formattedSalesData = salesData.map((product, index) => ({
          id: index + 1,
          feeldid: product._id,
          pid: product.id,
          name: product.customerName,
          products: product.products,
          customerdetails: product.customerdetails,
          mobileno: product.mobileno,
          orders: product.productName,
          orderid: product.kotId,
          orderstatus: product.orderstatus,
        }));

        console.log("Sales Data:", formattedSalesData);
        setSalesData(formattedSalesData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [selectedMeal]); // Include selectedMeal in the dependency array

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "mobileno",
      headerName: "Mobile NO",
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

  const handleUpdateStatus = async (feeldid, orderstatus) => {
    try {
      // Make an API request to update the order status
      await axios.put(`http://localhost:8084/api/v1/${feeldid}/update-data`, {
        orderstatus,
      });

      // Fetch the updated sales data
      const response = await axios.get(
        `http://localhost:8084/api/v1/data/getorders?meal=${selectedMeal}`
      );
      const updatedSalesData = response.data.map((product, index) => ({
        id: index + 1,
        feeldid: product._id,
        pid: product.id,
        name: product.customerName,
        products: product.products,
        customerdetails: product.customerdetails,
        mobileno: product.mobileno,
        orders: product.productName,
        orderid: product.orderId,
        orderstatus: product.orderstatus,
      }));

      // Update the sales data state with the updated data
      setSalesData(updatedSalesData);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* Add a dropdown for meal selection */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="mealSelect">Select Meal: </label>
        <select
          id="mealSelect"
          value={selectedMeal}
          onChange={handleMealChange}
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Diner">Dinner</option>
        </select>
      </div>
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
