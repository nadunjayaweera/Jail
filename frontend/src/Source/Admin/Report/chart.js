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
import { EventTracker } from "@devexpress/dx-react-chart";
import useSalesData from "./useSalesData";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { PieChart } from "@mui/x-charts/PieChart";
import { format } from "date-fns-tz";

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

const Topsell = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Get today's date and format it as "yyyy-MM-dd"
    const formattedDate = value ? format(value, "MMMM d, yyyy") : null;

    // Update the API URL with the formatted date
    const apiUrl = `http://localhost:8082/api/v1/data/sales?date=${encodeURIComponent(
      formattedDate
    )}`;

    console.log("API URL:", apiUrl); // Log the API URL

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
            value: item.totalQuantity,
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
      <h2>Top Selling Items</h2>
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

export { Chart, MonthlySales, Topsell };
