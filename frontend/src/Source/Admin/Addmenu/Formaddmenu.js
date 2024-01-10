import * as React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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
    border: "1px solid grey",
    borderRadius: "4px",
    padding: "5px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    maxWidth: "200px",
  },
  formControl: {
    marginBottom: "20px",
    minWidth: 120,
  },
}));

export default function FormAddMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [rowItems, setRowItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selecteddishMenu, setSelecteddishMenu] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8082/api/v1/itemname")
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item) => ({
          label: item.name,
          labelid: item._id,
        }));
        setMenuItems(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleGetRowItem = () => {
    fetch("http://localhost:8082/api/v1/getallrowitems")
      .then((response) => response.json())
      .then((data) => {
        const mappedRowData = data.map((item) => ({
          label: item.name,
          unit: item.productsaleunit,
        }));
        setRowItems(mappedRowData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { name: "", quantity: 0, unit: "" }]);
    handleGetRowItem();
  };

  const handleSelect = (event, value, index) => {
    if (value) {
      const selectedLabel = value.label;
      const selectedUnit = value.unit;

      const updatedItems = [...selectedItems];
      updatedItems[index] = {
        name: selectedLabel,
        quantity: "", // Set the default quantity to 0
        unit: selectedUnit,
      };

      setSelectedItems(updatedItems);
      setSelectedMenu(selectedLabel);

      console.log(
        `You selected "${selectedLabel}" with unit "${selectedUnit}"`
      );
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = () => {
    console.log("Selected Menu:", selectedMenu);

    const menuData = {
      menu: selecteddishMenu || "", // Use selectedMenu
      items: selectedItems, // Include all selected items
    };

    fetch("http://localhost:8082/api/v1/addmenu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Menu added successfully:", data);
        handleSnackbar("success", "Menu added successfully");
        setSelecteddishMenu("");
        setSelectedItems([]);
      })
      .catch((error) => {
        console.error("Error adding menu:", error);
        handleSnackbar("error", "Failed to add menu");
      });
  };

  return (
    <div className={useStyles.container}>
      {loading ? (
        "Loading..."
      ) : (
        <div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={menuItems}
            sx={{ width: 600 }}
            onChange={(event, value) => setSelecteddishMenu(value?.label || "")}
            renderInput={(params) => (
              <TextField {...params} label="Select Menu" />
            )}
          />

          {selectedItems.map((item, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <Autocomplete
                disablePortal
                id={`combo-box-item-${index}`}
                options={rowItems}
                getOptionLabel={(option) => option.label}
                sx={{ width: 600 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Item"
                    onChange={(e) =>
                      handleSelect(
                        e,
                        { label: e.target.value, unit: "" },
                        index
                      )
                    }
                  />
                )}
                onChange={(event, value) => handleSelect(event, value, index)}
              />
              <div style={{ marginTop: "10px" }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...selectedItems];
                    updatedItems[index].quantity = e.target.value;
                    setSelectedItems(updatedItems);
                  }}
                />
                <TextField
                  label="Unit"
                  value={item.unit}
                  sx={{ width: 100 }}
                  onChange={(e) => {
                    const updatedItems = [...selectedItems];
                    updatedItems[index].unit = e.target.value;
                    setSelectedItems(updatedItems);
                  }}
                />
              </div>
            </div>
          ))}
          <Button onClick={handleAddItem} style={{ marginBottom: "20px" }}>
            ADD
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
