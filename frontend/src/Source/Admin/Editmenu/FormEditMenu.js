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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormEditMenu() {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null); // Selected menu for editing
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { field: "menu", headerName: "Menu", width: 200 },
    {
      field: "items",
      headerName: "Items",
      width: 300,
      renderCell: (params) => (
        <div>
          {params.row.items.map((item) => (
            <div key={item.name}>
              {`${item.name}: ${item.quantity} ${item.unit}`}
            </div>
          ))}
        </div>
      ),
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
    fetch("http://localhost:8082/api/v1/getallmenus")
      .then((response) => response.json())
      .then((data) => {
        // Rename "_id" to "id" in each row
        const formattedData = data.map((row) => {
          return { ...row, id: row._id };
        });
        console.log("Incomming Error:", formattedData);
        // Update the component state with the formatted data
        setMenus(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (row) => {
    // Handle edit action, e.g., navigate to an edit page
    console.log("Edit clicked for ID:", row);
    setSelectedMenu(row); // Set the selected item data
    setOpenDialog(true); // Open the dialog
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...selectedMenu.items];
    updatedItems.splice(index, 1);
    setSelectedMenu({
      ...selectedMenu,
      items: updatedItems,
    });
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleDelete = () => {
    if (selectedMenu) {
      const id = selectedMenu.id; // Assuming 'id' is the correct property name
      if (window.confirm("Are you sure you want to delete this menu?")) {
        fetch(`http://localhost:8082/api/v1/deletemenu/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.status === 200) {
              // Menu deleted successfully
              console.log("Menu deleted:", id);

              // Update the state to remove the deleted menu from the list
              setMenus((prevMenus) =>
                prevMenus.filter((menu) => menu.id !== id)
              );
              setOpenDialog(false); // Close the dialog after deleting
            } else {
              // Handle the case when deletion fails
              console.error("Failed to delete menu:", id);
            }
          })
          .catch((error) => {
            console.error("Error deleting menu:", error);
          });
      }
    }
  };

  const handleSaveChanges = () => {
    if (selectedMenu) {
      // Make a PUT request to update the menu
      fetch(`http://localhost:8082/api/v1/updatemenu/${selectedMenu._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMenu),
      })
        .then((response) => response.json())
        .then((updatedMenu) => {
          console.log("Menu updated:", updatedMenu);
          setOpenDialog(false); // Close the dialog after saving changes

          // After saving changes, refetch the data to update the form
          fetch("http://localhost:8082/api/v1/getallmenus")
            .then((response) => response.json())
            .then((data) => {
              // Rename "_id" to "id" in each row
              const formattedData = data.map((menu) => {
                return { ...menu, id: menu._id };
              });

              // Update the component state with the formatted data
              setMenus(formattedData);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        })
        .catch((error) => {
          console.error("Error updating menu:", error);
        });
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid rows={menus} columns={columns} pageSize={5} checkboxSelection />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {/* Display the selected item data for editing */}
          {selectedMenu && (
            <form>
              <div style={{ marginTop: 20 }}>
                <Typography>{`Menu: ${selectedMenu.menu}`}</Typography>
              </div>
              <div style={{ marginTop: 20 }}>
                {/* Map through the items array to display each item */}
                {selectedMenu.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Typography
                      style={{ marginRight: 10 }}
                    >{`Item: ${item.name}`}</Typography>
                    <TextField
                      style={{ marginRight: 10 }}
                      label={`Item ${index + 1} Quantity`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...selectedMenu.items];
                        updatedItems[index].quantity = e.target.value;
                        setSelectedMenu({
                          ...selectedMenu,
                          items: updatedItems,
                        });
                      }}
                    />
                    <Typography
                      style={{ marginRight: 10 }}
                    >{`Unit: ${item.unit}`}</Typography>
                    <IconButton
                      onClick={() => handleDeleteItem(index)}
                      style={{ color: "red" }}
                      aria-label={`delete-item-${index}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
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
