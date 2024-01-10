import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import MenuItem from "@mui/material/MenuItem";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

export default function FormAddStock() {
  const [rows, setRows] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for editing
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "productcost", headerName: "Product Cost", width: 100 },
    { field: "stockalert", headerName: "Stock Alert", width: 100 },
    // { field: "productunit", headerName: "Product Unit", width: 100 },
    { field: "productsaleunit", headerName: "Product Sale Unit", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    {
      field: "productperchaseunit",
      headerName: "Product Purchase Unit",
      width: 100,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    // Fetch data from the API when the component is mounted
    fetch("https://backfood.tfdatamaster.com/api/v1/getallrowitems")
      .then((response) => response.json())
      .then((data) => {
        // Rename "_id" to "id" in each row
        const formattedData = data.map((row) => {
          return { ...row, id: row._id };
        });
        console.log("Incomming Error:", formattedData);
        // Update the component state with the formatted data
        setRows(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (row) => {
    // Handle edit action, e.g., navigate to an edit page
    console.log("Edit clicked for ID:", row);
    setSelectedItem(row); // Set the selected item data
    setOpenDialog(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Send a DELETE request to the API
      fetch(`https://backfood.tfdatamaster.com/api/v1/deleterowitem/${_id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.status === 200) {
            // Item deleted successfully
            console.log("Item deleted:", _id);

            // Update the state to remove the deleted item from the list
            setRows((prevRows) => prevRows.filter((row) => row._id !== _id));
          } else {
            // Handle the case when deletion fails
            console.error("Failed to delete item:", _id);
          }
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    }
  };

  const handleSaveChanges = () => {
    if (selectedItem) {
      // Make a PUT request to update the item
      fetch(
        `https://backfood.tfdatamaster.com/api/v1/updaterowitem/${selectedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedItem),
        }
      )
        .then((response) => response.json())
        .then((updatedItem) => {
          console.log("Item updated:", updatedItem);
          setOpenDialog(false); // Close the dialog after saving changes

          // After saving changes, refetch the data to update the form
          fetch("https://backfood.tfdatamaster.com/api/v1/getallrowitems")
            .then((response) => response.json())
            .then((data) => {
              // Rename "_id" to "id" in each row
              const formattedData = data.map((row) => {
                return { ...row, id: row._id };
              });

              // Update the component state with the formatted data
              setRows(formattedData);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {/* Display the selected item data for editing */}
          {selectedItem && (
            <form>
              <div style={{ marginTop: 20 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <TextField
                  fullWidth
                  label="Product Cost"
                  type="number"
                  value={selectedItem.productcost}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      productcost: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <TextField
                  fullWidth
                  label="Stock Alert"
                  type="number"
                  value={selectedItem.stockalert}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      stockalert: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={selectedItem.stock}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      stock: e.target.value,
                    })
                  }
                />
              </div>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
