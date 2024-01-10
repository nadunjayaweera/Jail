import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

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
    border: `1px solid grey`,
    borderRadius: "4px",
    padding: "5px",
    position: "relative",
  },
  formControl: {
    marginBottom: "10px",
    minWidth: 120,
  },
}));

export default function FormEditProduct() {
  const { productId } = useParams(); // Step 1: Get the productId from the URL
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  const [currentProductId, setCurrentProductId] = React.useState(null);

  const [promotionStatus, setPromotionStatus] = React.useState("notPromoted");
  const [formData, setFormData] = React.useState({
    name: "",
    price: "",
    description: "",
    image: "",
    promotionStatus: promotionStatus,
  });
  const [image, setImage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const product = location.state?.product;

    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        promotionStatus: product.promotionStatus,
      });

      setCurrentProductId(product.pid);
      setPromotionStatus(product.promotionStatus);
    }
  }, [location.state]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "promotionStatus") {
      setPromotionStatus(value);
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
      const base64Image = reader.result.split(",")[1];
      setImage(base64Image);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: base64Image,
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

    fetch(
      `https://backfood.tfdatamaster.com/api/v1/updateproduct/${currentProductId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      }
    )
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
      {hasErrors && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Please fill out all fields.
        </Alert>
      )}
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Edit Item
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
