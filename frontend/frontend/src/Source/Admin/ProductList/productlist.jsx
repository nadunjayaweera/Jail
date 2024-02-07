import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  "& .categoryCell": {
    display: "flex",
    alignItems: "center",
  },
}));

export default function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [editRowsModel, setEditRowsModel] = React.useState({});
  const [salesData, setSalesData] = React.useState([]);

  React.useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8084/api/v1/data/items"
        );
        console.log("API Response:", response.data);

        const formattedSalesData = response.data.map((sale, index) => ({
          id: index + 1,
          pid: sale._id,
          name: sale.name,
          price: sale.price,
          description: sale.description,
          category: sale.category,
          image: sale.image,
        }));

        console.log("Sales Data:", formattedSalesData);
        setSalesData(formattedSalesData);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchSalesData();
  }, []);

  const handleEditProduct = (product) => {
    navigate(`/products/edit/${product.pid}`, {
      state: { product: product },
    });
  };

  const handleDelete = async (pid) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this row?"
      );
      if (confirmed) {
        await axios.delete(`http://localhost:8084/api/v1/deleteitem/${pid}`);
        // Handle success response, if needed
        // Refresh the list of items or update UI accordingly
        const updatedSalesData = salesData.filter((sale) => sale.pid !== pid);
        setSalesData(updatedSalesData);
      }
    } catch (error) {
      console.error(error);
      // Handle error, if needed
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "price", headerName: "Price (Rs.)", type: "number", width: 120 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={`data:image/jpeg;base64,${params.row.image}`}
          alt={params.row.name}
          style={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <Link to={`/products/edit/${params.row.pid}`}>
            <EditIcon onClick={() => handleEditProduct(params.row)} />
          </Link>

          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => handleDelete(params.row.pid)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <StripedDataGrid
        rows={salesData}
        columns={columns}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={(newModel) => setEditRowsModel(newModel)}
      />
    </div>
  );
}
