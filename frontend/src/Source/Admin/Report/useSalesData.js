import { useState, useEffect } from "react";

const useSalesData = (dataType, numberOfDays) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch sales data from backend API
    fetch("http://localhost:8084/api/v1/getsellindata")
      .then((response) => response.json())
      .then((salesData) => {
        // Process the sales data based on the dataType parameter
        const processedData =
          dataType === "monthly"
            ? processMonthlyData(salesData)
            : processDailyData(salesData, numberOfDays); // Pass the numberOfDays parameter

        setData(processedData);
      })
      .catch((error) => console.error("Error fetching sales data:", error));
  }, [dataType, numberOfDays]); // Include numberOfDays in the dependency array

  // Process monthly data
  const processMonthlyData = (salesData) => {
    console.log("SalesData", salesData);
    const groupedData = salesData.reduce((result, item) => {
      const date = new Date(item.timestamp);
      const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      if (result[key]) {
        result[key].amount += parseInt(item.totalPrice);
      } else {
        result[key] = {
          month: month.toString(),
          year: year.toString(),
          amount: parseInt(item.totalPrice),
        };
      }
      return result;
    }, {});
    console.log("Date month:", groupedData);
    return Object.values(groupedData);
  };
  // Process daily data and return the last 'numberOfDays' days
  const processDailyData = (salesData, numberOfDays) => {
    // Sort sales data by timestamp in descending order (most recent first)
    const sortedData = salesData.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });

    // Select the last 'numberOfDays' items (most recent 'numberOfDays' days)
    const lastNDaysData = sortedData.slice(0, numberOfDays);

    // Group data by date and calculate total sales for each day
    const groupedData = lastNDaysData.reduce((result, item) => {
      const date = item.timestamp.split(",")[0].trim();
      if (result[date]) {
        result[date].amount += parseInt(item.totalPrice);
      } else {
        result[date] = {
          date,
          amount: parseInt(item.totalPrice),
        };
      }
      return result;
    }, {});

    return Object.values(groupedData);
  };

  return data;
};

export default useSalesData;
