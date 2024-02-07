import * as React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import MenuItem from "@mui/material/MenuItem";
// import LoadingSpinner from '../LoadingSpinner';

const useStyles = makeStyles(() => ({
  container: {
    padding: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  imageContainer: {
    border: "1px solid grey", // Replace with your desired border style
    borderRadius: "4px", // Replace with your desired border radius value or CSS property
    padding: "5px", // Replace with your desired padding value or CSS property
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px", // Replace with your desired height value or CSS property
    maxWidth: "200px", // Replace with your desired max width value or CSS property
  },
  formControl: {
    marginBottom: "20px",
    minWidth: 120,
  },
}));

const ProductUnit = [
  {
    value: "1",
    label: "Kg",
  },
  {
    value: "2",
    label: "Piece",
  },
  {
    value: "3",
    label: "L",
  },
];

const Kilo = [
  {
    value: "Kg",
    label: "Kg",
  },
  {
    value: "g",
    label: "g",
  },
];

const Liter = [
  {
    value: "L",
    label: "L",
  },
  {
    value: "ml",
    label: "ml",
  },
];

export default function FormAddrowProduct() {
  const [formData, setFormData] = useState({
    name: "",
    productcost: "",
    stockalert: "",
    productunit: "",
    productsaleunit: "",
    productperchaseunit: "",
    stock: "0",
  });

  const [productSaleUnitOptions, setProductSaleUnitOptions] = useState([]);
  const [productPurchaseUnitOptions, setProductPurchaseUnitOptions] = useState(
    []
  );

  const handleProductUnitChange = (event) => {
    const selectedUnit = event.target.value;

    // Update the selected product unit in the form data
    setFormData({
      ...formData,
      productunit: selectedUnit,
    });

    // Set Product Sale Unit options based on the selected Product Unit
    switch (selectedUnit) {
      case "1":
        setProductSaleUnitOptions(Kilo);
        setProductPurchaseUnitOptions(Kilo);
        break;
      case "2":
        setProductSaleUnitOptions([{ value: "Piece", label: "Piece" }]);
        setProductPurchaseUnitOptions([{ value: "Piece", label: "Piece" }]);
        break;
      case "3":
        setProductSaleUnitOptions(Liter);
        setProductPurchaseUnitOptions(Liter);
        break;
      default:
        setProductSaleUnitOptions([]);
        setProductPurchaseUnitOptions([]);
    }
  };

  const handleSubmit = async () => {
    // You can now access the form data from the formData state variable
    console.log(formData);

    // Send a POST request to the server
    try {
      const response = await fetch("http://localhost:8084/api/v1/addrowitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Item added successfully");
        window.location.reload();
      } else {
        alert("Item added successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "50ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          name="name"
          label="Item Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          required
          name="productcost"
          label="Product Cost"
          onChange={(e) =>
            setFormData({ ...formData, productcost: e.target.value })
          }
        />
        <TextField
          required
          name="stockalert"
          label="Stock Alert"
          onChange={(e) =>
            setFormData({ ...formData, stockalert: e.target.value })
          }
        />
        <TextField
          required
          name="productunit"
          label="Product Unit"
          select
          onChange={handleProductUnitChange}
          helperText="Which Unit use to measure item"
        >
          {ProductUnit.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="productsaleunit"
          select
          label="Product Sale Unit"
          onChange={(e) =>
            setFormData({ ...formData, productsaleunit: e.target.value })
          }
          helperText="Which Unit use to Sale"
        >
          {productSaleUnitOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="productperchaseunit"
          select
          label="Product Purchase Unit"
          onChange={(e) =>
            setFormData({ ...formData, productperchaseunit: e.target.value })
          }
          helperText="Which Unit use to Purchase"
        >
          {productPurchaseUnitOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div style={{ marginLeft: "50%", marginTop: 20 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Box>
  );
}
