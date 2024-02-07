import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Grid, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns-tz";

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

export default function FormStockexpenses() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "unit", headerName: "Unit", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 200 },
    { field: "productCost", headerName: "Product Cost", width: 200 },
  ];

  useEffect(() => {
    // Fetch data from the API when the component is mounted
    const formattedStartDate = startDate
      ? format(startDate, "yyyy-MM-dd", { timeZone: "Asia/Colombo" })
      : null;
    const formattedEndDate = endDate
      ? format(endDate, "yyyy-MM-dd", { timeZone: "Asia/Colombo" })
      : null;

    const apiUrl = `http://localhost:8084/api/v1/stock?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    console.log("URL end point", apiUrl);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Rename "_id" to "id" in each row and add a unique identifier
        const formattedData = data.map((row, index) => {
          return { ...row, id: index + 1 }; // Assuming index is 0-based, add 1 to avoid id being 0
        });
        console.log("Incoming Error:", formattedData);
        // Update the component state with the formatted data
        setRows(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [startDate, endDate]);

  return (
    <div>
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={6}>
          <InputLabel htmlFor="start-date">Start Date</InputLabel>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel htmlFor="end-date">End Date</InputLabel>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
          />
        </Grid>
      </Grid>

      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </div>
  );
}
