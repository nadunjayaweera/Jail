import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import axios from "axios";

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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Orders() {
  const [editRowsModel, setEditRowsModel] = React.useState({});
  const [salesData, setSalesData] = React.useState([]);

  React.useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8084/api/v1/getsales"
        );
        console.log("API Response:", response.data);

        const formattedSalesData = response.data.map((sale, index) => ({
          id: index + 1,
          date: sale.timestamp,
          name: sale.customerName,
          orderid: sale.orderId,
          amount: sale.totalPrice,
          paymentmethod: sale.paymentmethod,
          products: sale.products
            .map(
              (product) =>
                `${product.productName} (Date: ${product.date}, Meal: ${product.meal}, Price: ${product.price})`
            )
            .join(", "),
          customerdetails: sale.customerdetails
            .map(
              (details) =>
                `${Object.keys(details)
                  .map((key) => `${key}: ${details[key]}`)
                  .join(", ")}`
            )
            .join(", "),
        }));

        console.log("Sales Data:", formattedSalesData);
        setSalesData(formattedSalesData);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchSalesData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "orderid", headerName: "OrderID", width: 150 },
    { field: "date", headerName: "Date", width: 250 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "products", headerName: "Products", width: 550 },
    { field: "customerdetails", headerName: "Customer Details", width: 550 },
    {
      field: "amount",
      headerName: "Amount (Rs. )",
      type: "number",
      width: 100,
    },
    { field: "paymentmethod", headerName: "Payment Method", width: 150 },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <StripedDataGrid
        rows={salesData}
        columns={columns}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={(newModel) => setEditRowsModel(newModel)}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
