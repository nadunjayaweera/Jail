import StockDAO from "../../dao/stockDAO.js";

const getStockData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stockData = await StockDAO.getStockData(startDate, endDate);

    // Update the response to convert quantity to Kg if unit is "g" and quantity is >= 1000
    const updatedStockData = stockData.map((item) => {
      if (item.unit === "g" && item.quantity >= 1000) {
        return {
          ...item,
          unit: "Kg",
          quantity: (item.quantity / 1000).toFixed(3), // Convert to Kg and round to 3 decimal places
        };
      } else if (item.unit === "ml" && item.quantity >= 1000) {
        return {
          ...item,
          unit: "L",
          quantity: (item.quantity / 1000).toFixed(3), // Convert to L and round to 3 decimal places
        };
      } else {
        return item;
      }
    });

    res.json(updatedStockData);
  } catch (err) {
    console.error(`Error getting stock data: ${err}`);
    res.status(500).json({ error: err });
  }
};

export default {
  getStockData,
};
