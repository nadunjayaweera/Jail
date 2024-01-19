// data.controller.mjs
import sharp from "sharp";
import DataDAO from "../dao/dataDAO.js";

export default class DataController {
  static async getData(req, res, next) {
    try {
      const data = await DataDAO.getData();
      res.json(data);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getItem(req, res, next) {
    try {
      const data = await DataDAO.getItem();

      // Process the images to reduce quality
      const processedData = await Promise.all(
        data.map(async (item) => {
          const processedImage = await sharp(Buffer.from(item.image, "base64"))
            .jpeg({ quality: 5 }) // Reduce quality to 10%
            .toBuffer();
          return {
            ...item,
            image: processedImage.toString("base64"),
          };
        })
      );

      res.json(processedData);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getItemcategoryvice(req, res, next) {
    try {
      const category = req.query.category; // Extract category from query parameters
      const data = await DataDAO.getItemcategoryvice(category);

      // Process the images to reduce quality
      const processedData = await Promise.all(
        data.map(async (item) => {
          const processedImage = await sharp(Buffer.from(item.image, "base64"))
            .jpeg({ quality: 5 }) // Reduce quality to 10%
            .toBuffer();
          return {
            ...item,
            image: processedImage.toString("base64"),
          };
        })
      );

      res.json(processedData);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getItemName(req, res, next) {
    try {
      const data = await DataDAO.getItem();

      // Process the images to reduce quality
      const processedData = await Promise.all(
        data.map(async (item) => {
          const processedImage = await sharp(Buffer.from(item.image, "base64"))
            .jpeg({ quality: 5 }) // Reduce quality to 10%
            .toBuffer();
          return {
            _id: item._id,
            name: item.name,
          };
        })
      );

      res.json(processedData);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getItempart(req, res, next) {
    try {
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // Set a default value or change it as needed
      const category = req.query.category;
      const data = await DataDAO.getItempart(
        pageNumber,
        itemsPerPage,
        category
      );
      res.json(data);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async updateOrderStatus(req, res, next) {
    const orderId = req.params.orderId; // Assuming the orderId is passed as a route parameter
    console.log("OrderId:", orderId);

    try {
      const currentStatus = await DataDAO.getOrderStatus(orderId);
      console.log("Current Order Status:", currentStatus);

      let newStatus;

      if (currentStatus === "Pending") {
        newStatus = "Processing";
      } else if (currentStatus === "Processing") {
        newStatus = "Done";
      } else if (currentStatus === "Done") {
        newStatus = "Delivered";
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid current order status",
        });
        return;
      }

      const updateSuccessful = await DataDAO.updateOrderStatus(
        orderId,
        newStatus
      );
      if (updateSuccessful) {
        res.json({
          success: true,
          message: "Order status updated successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update order status",
        });
      }
    } catch (err) {
      console.error(`Error updating order status: ${err}`);
      res.status(500).json({ success: false, error: err });
    }
  }

  static async getUserOrders(req, res, next) {
    const employeeid = req.params.employeeid; // Assuming the email is passed as a route parameter
    try {
      const orders = await DataDAO.getUserOrders(employeeid);

      // Filter orders where the orderStatus is not equal to 'Delivered'
      const filteredOrders = orders.filter(
        (order) => order.productStatus !== "Delivered"
      );

      res.json(filteredOrders);
    } catch (err) {
      console.error(`Error getting user orders: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async updateDataValue(req, res, next) {
    const value = req.body.value; // Assuming the itemId is passed as a route parameter

    try {
      const updateSuccessful = await DataDAO.updateData(value);

      if (updateSuccessful) {
        res.json({
          success: true,
          message: "Data ID updated successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update Data ID",
        });
      }
    } catch (err) {
      console.error(`Error updating Data ID: ${err}`);
      res.status(500).json({ success: false, error: err });
    }
  }

  static async addSale(req, res, next) {
    try {
      const {
        customerName,
        customerdetails,
        products,
        totalPrice,
        mobileno,
        role,
      } = req.body;
      const result = await DataDAO.addSale(
        customerName,
        customerdetails,
        products,
        totalPrice,
        mobileno,
        role
      );
      if (result) {
        res.json({ success: true, message: "Sale added successfully" });
      } else {
        throw new Error("Failed to add sale");
      }
    } catch (err) {
      console.error(`Error adding sale: ${err}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSale(req, res, next) {
    try {
      const data = await DataDAO.getSale();
      res.json(data);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getdailyorders(req, res, next) {
    const meal = req.query.meal;
    try {
      const orders = await DataDAO.getdailyorders(meal);
      res.json(orders);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getSalesByDate(req, res, next) {
    const date = req.query.date; // Assuming the date is passed as a query parameter

    try {
      const sales = await DataDAO.getSalesByDate(date);
      res.json(sales);
    } catch (err) {
      console.error(`Error getting sales by date: ${err}`);
      res.status(500).json({ error: err });
    }
  }
}
