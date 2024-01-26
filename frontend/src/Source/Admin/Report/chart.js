import React, { useState, useEffect } from "react"; // Import useState
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Pie,
} from "recharts";
import Title from "../title";
import Card from "@mui/material/Card";
import { EventTracker } from "@devexpress/dx-react-chart";
import useSalesData from "./useSalesData";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PieChart } from "@mui/x-charts/PieChart";
import { format } from "date-fns-tz";
import { DataGrid } from "@mui/x-data-grid";
const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthlySales = () => {
  const theme = useTheme();
  const data = useSalesData("monthly");

  // Group data by month and calculate total sales for each month
  const monthlyData = data.reduce((result, item) => {
    const month = parseInt(item.month) - 1; // Convert month to zero-indexed
    if (result[month]) {
      result[month].amount += item.amount;
    } else {
      result[month] = {
        month: month,
        amount: item.amount,
      };
    }
    console.log("Sale:", item);
    return result;
  }, []);

  // Format data for the LineChart
  const formattedData = monthLabels.map((label, index) => ({
    month: label,
    amount: monthlyData[index]?.amount || 0,
  }));

  return (
    <React.Fragment>
      <Title>Monthly Sales</Title>
      <ResponsiveContainer width="100%" height={175}>
        <LineChart
          data={formattedData} // Use the formatted data
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="month"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales (Rs.)
            </Label>
          </YAxis>
          <EventTracker />
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

const SalesReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalCardPayment, setTotalCardPayment] = useState(null);
  const [totalCashPayment, setTotalCashPayment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) {
        console.error("Please select both start and end dates.");
        return;
      }

      try {
        // Use your API endpoint here
        const apiUrl = `http://localhost:8084/api/v1/getsalesreports?startdate=${format(
          startDate,
          "yyyy/MM/dd"
        )}&enddate=${format(endDate, "yyyy/MM/dd")}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Process the data and calculate totals
        const total = data.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalAmount(total);

        const cardPayments = data.filter(
          (item) => item.paymentmethod.toLowerCase() === "card"
        );
        const totalCard = cardPayments.reduce(
          (acc, item) => acc + item.totalPrice,
          0
        );
        setTotalCardPayment(totalCard);

        const cashPayments = data.filter(
          (item) => item.paymentmethod.toLowerCase() === "cash"
        );
        const totalCash = cashPayments.reduce(
          (acc, item) => acc + item.totalPrice,
          0
        );
        setTotalCashPayment(totalCash);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div>
      <Title>Sales Report</Title>
      <div>
        <label htmlFor="start-date">Start Date: </label>
        <input
          type="date"
          id="start-date"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="end-date">End Date: </label>
        <input
          type="date"
          id="end-date"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </div>

      {totalAmount !== null && (
        <Card
          component={Stack}
          spacing={3}
          direction="row"
          sx={{
            px: 3,
            py: 5,
            borderRadius: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4">{totalAmount}</Typography>
            <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              Total Sales Amount
            </Typography>
          </Stack>
        </Card>
      )}

      {totalCashPayment !== null && (
        <Card
          component={Stack}
          spacing={3}
          direction="row"
          sx={{
            px: 3,
            py: 5,
            borderRadius: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4">{totalCashPayment}</Typography>
            <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              Total Cash Payment
            </Typography>
          </Stack>
        </Card>
      )}

      {totalCardPayment !== null && (
        <Card
          component={Stack}
          spacing={3}
          direction="row"
          sx={{
            px: 3,
            py: 5,
            borderRadius: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4">{totalCardPayment}</Typography>
            <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              Total Card Payment
            </Typography>
          </Stack>
        </Card>
      )}
    </div>
  );
};

const Topsell = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Get today's date and format it as "yyyy/MM/dd"
    const formattedDate = value ? format(value, "yyyy/MM/dd") : null;
    console.log("Date", formattedDate);
    // Update the API URL with the formatted date
    const apiUrl = `http://localhost:8084/api/v1/data/topsellingitems?date=${formattedDate}`;

    console.log("API URLllll:", apiUrl); // Log the API URL

    // Clear the data before making the API request
    setData([]);

    // Make a GET request to your API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((apiData) => {
        if (Array.isArray(apiData) && apiData.length > 0) {
          // Process the data into the format expected by PieChart
          const chartData = apiData.map((item) => ({
            id: item._id, // Assuming you want to use _id as the id property
            value: item.count,
            label: item._id, // You can use _id as the label property
          }));
          setData(chartData);
        } else {
          setData([]); // Set an empty array if there's no data
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [value]);

  return (
    <div>
      <Title>Top Selling Item</Title>
      <div>
        <label htmlFor="top-sell-date">Select Date: </label>
        <input
          type="date"
          id="top-sell-date"
          value={value ? format(value, "yyyy-MM-dd") : ""}
          onChange={(e) => setValue(new Date(e.target.value))}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.length > 0 ? (
            <PieChart
              series={[
                {
                  data: data, // Use chartData here
                },
              ]}
              width={550}
              height={400}
            />
          ) : (
            <p>No data available.</p>
          )}
        </>
      )}
    </div>
  );
};

const Chart = () => {
  const theme = useTheme();
  const data = useSalesData("daily");
  const reversedData = data.slice(0, 30).reverse();
  return (
    <React.Fragment>
      <Title>Sales for Each Day in the Month</Title>
      <ResponsiveContainer width="100%" height={175}>
        <LineChart
          data={reversedData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales (Rs.)
            </Label>
          </YAxis>
          <EventTracker />
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const [mealType, setMealType] = useState(""); // Initial meal type is an empty string

  useEffect(() => {
    const formattedDate = value ? format(value, "yyyy/MM/dd") : null;
    const apiUrl = `http://localhost:8084/api/v1/data/topsellingitems?date=${formattedDate}&mealType=${mealType}`;

    setData([]); // Clear the data before making the API request

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((apiData) => {
        if (Array.isArray(apiData) && apiData.length > 0) {
          const tableData = apiData.map((item, index) => ({
            id: index + 1, // You can adjust this based on your data structure
            ...item,
          }));
          setData(tableData);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [value, mealType]);

  const columns = [
    { field: "_id", headerName: "Product Name", width: 200 },
    { field: "count", headerName: "Count", width: 150 },
  ];

  return (
    <div>
      <Title>Total Orders</Title>
      <div>
        <label htmlFor="top-sell-date">Select Date: </label>
        <input
          type="date"
          id="top-sell-date"
          value={value ? format(value, "yyyy-MM-dd") : ""}
          onChange={(e) => setValue(new Date(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="meal-type">Select Meal Type: </label>
        <select
          id="meal-type"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          <option value="">All</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Diner">Dinner</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ height: "100%", width: "100%" }}>
          {data.length > 0 ? (
            <DataGrid rows={data} columns={columns} pageSize={5} />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export { Chart, MonthlySales, Topsell, Table, SalesReport };
