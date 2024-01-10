import * as React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
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

export default function FormAddProduct() {
  const [promotionStatus, setPromotionStatus] = React.useState("notPromoted");
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [image, setImage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    price: "",
    description: "",
    image: image, // Add a new property for the base64-encoded image
    promotionStatus: promotionStatus,
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "promotionStatus") {
      setPromotionStatus(value); // Update promotionStatus state
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      promotionStatus:
        name === "promotionStatus" ? value : prevFormData.promotionStatus,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result.split(",")[1]; // Extract the base64-encoded image string
      setImage(base64Image);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: base64Image, // Update the form data with the base64-encoded image string
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();

    const hasEmptyFields = Object.values(formData).some(
      (value) => !value.trim()
    );

    if (hasEmptyFields) {
      setHasErrors(true);
      return;
    }

    const updatedFormData = {
      ...formData,
      promotionStatus: promotionStatus,
    };

    fetch("http://localhost:8082/api/v1/additem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        navigate("/products");
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* {isLoading && <LoadingSpinner />} */}
      {hasErrors && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Please fill out all fields.
        </Alert>
      )}
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Add Item
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Product Name"
            variant="outlined"
            value={formData.name}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="price"
            name="price"
            label="Price"
            variant="outlined"
            value={formData.price}
            onChange={handleFormChange}
            type="number"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            value={formData.description}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            aria-label="promotionStatus"
            name="promotionStatus"
            value={promotionStatus}
            onChange={(e) => setPromotionStatus(e.target.value)}
            row
          >
            <FormControlLabel
              value="notPromoted"
              control={<Radio />}
              label="Not Promoted"
            />
            <FormControlLabel
              value="promoted"
              control={<Radio />}
              label="Promoted"
            />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
            }}
          >
            <div>
              <label htmlFor="image-upload">Product Image</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.image && <span>{formData.image.name}</span>}
            </div>
          </Box>
          <div className={classes.imageContainer}>
            {image && (
              <div>
                <img
                  src={`data:image/jpeg;base64,${image}`}
                  alt="product image"
                  style={{ maxWidth: 200, maxHeight: 200 }}
                  loading="lazy"
                />
              </div>
            )}
            {!image && (
              <div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/2048px-Antu_insert-image.svg.png"
                  alt="product image"
                  style={{ maxWidth: 200, maxHeight: 200 }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
