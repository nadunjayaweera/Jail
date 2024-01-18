import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let item;
let sale;
let orders;
let menus;
let rowitems;
let stocks;

// Object to keep track of cumulative quantities for each product
let cumulativeQuantities = {};

export default class DataDAO {
  static async injectDB(conn) {
    if (item && sale && orders && menus && rowitems && stocks) {
      return;
    }
    try {
      item = await conn.db(process.env.DATA_BASE_NAME).collection("item");
      sale = await conn.db(process.env.DATA_BASE_NAME).collection("sales");
      orders = await conn.db(process.env.DATA_BASE_NAME).collection("orders");
      menus = await conn.db(process.env.DATA_BASE_NAME).collection("menus");
      rowitems = await conn
        .db(process.env.DATA_BASE_NAME)
        .collection("rowitem");
      stocks = await conn.db(process.env.DATA_BASE_NAME).collection("stock");
    } catch (err) {
      console.error(
        `Unable to establish collection handles in DataDAO: ${err}`
      );
    }
  }

  static async addSale(
    customerName,
    customerdetails,
    products,
    totalPrice,
    mobileno,
    role
  ) {
    if (!sale || !orders || !menus || !rowitems || !stocks) {
      throw new Error("DataDAO not initialized");
    }
    try {
      // Get the current Unix timestamp
      const unixTimestamp = Math.floor(new Date().getTime() / 1000);

      // Use the Unix timestamp as orderId
      const formattedOrderId = unixTimestamp.toString();

      const timestamp = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const groupedOrders = {};

      // Group products based on the same date and meal category
      for (const product of products) {
        const key = `${product.date}_${product.meal}`;
        if (!groupedOrders[key]) {
          groupedOrders[key] = {
            customerName,
            customerdetails,
            products: [product],
            mobileno,
            role,
            orderstatus: "Pending",
            orderId: formattedOrderId,
          };
        } else {
          groupedOrders[key].products.push(product);
        }
      }

      // Insert data into the orders collection for each group
      for (const key in groupedOrders) {
        await orders.insertOne(groupedOrders[key]);
      }

      const sales = {
        orderId: formattedOrderId,
        customerName,
        customerdetails,
        products,
        totalPrice,
        timestamp,
        mobileno,
        role,
      };

      const result = await sale.insertOne(sales);

      // Fetch and log menu details for each product in the order
      for (const product of products) {
        const productName = product.productName;
        const quantityOrdered = product.quantity;

        // Fetch menu details for the product from the menus collection
        const menuDetails = await menus.findOne({ menu: productName });

        if (menuDetails) {
          // Multiply the menu item quantity by the quantity ordered
          const updatedMenuItems = menuDetails.items.map((item) => ({
            ...item,
            quantity: (
              parseInt(item.quantity, 10) * parseInt(quantityOrdered, 10)
            ).toString(),
          }));

          // Update cumulative quantities for the product
          if (!cumulativeQuantities[productName]) {
            cumulativeQuantities[productName] = {
              ...menuDetails,
              items: updatedMenuItems,
            };
          } else {
            cumulativeQuantities[productName].items.forEach((item, index) => {
              const existingItem = updatedMenuItems.find(
                (updatedItem) => updatedItem.name === item.name
              );

              if (existingItem) {
                item.quantity = (
                  parseInt(item.quantity, 10) +
                  parseInt(existingItem.quantity, 10)
                ).toString();
              }
            });
          }

          console.log(
            `Updated menu details for product "${productName}":`,
            cumulativeQuantities[productName]
          );
        } else {
          console.log(`Menu details not found for product "${productName}"`);
        }
      }

      // Create a new object to store merged quantities for each item
      const mergedQuantities = {};

      // Iterate over cumulativeQuantities and merge quantities for items with the same name
      Object.values(cumulativeQuantities).forEach(({ items }) => {
        items.forEach(({ name, quantity, unit }) => {
          if (!mergedQuantities[name]) {
            mergedQuantities[name] = { name, quantity, unit };
          } else {
            mergedQuantities[name].quantity = (
              parseInt(mergedQuantities[name].quantity, 10) +
              parseInt(quantity, 10)
            ).toString();
          }
        });
      });

      // Convert the mergedQuantities object to an array
      const combinedItems = Object.values(mergedQuantities);
      // Update stock in rowitem collection based on combinedItems
      for (const combinedItem of combinedItems) {
        const { name, quantity, unit } = combinedItem;
        // Retrieve the corresponding document from the rowitem collection
        const rowItem = await rowitems.findOne({ name });

        if (rowItem) {
          const { productsaleunit, productperchaseunit, stock, productcost } =
            rowItem;

          // Check if product units are the same
          if (productsaleunit === productperchaseunit) {
            // Units are the same, subtract quantity directly
            const updatedStock = stock - parseInt(quantity, 10);
            console.log("Product naem:", name);
            console.log("Quantity:", quantity);
            console.log("Unit:", unit);
            console.log("Product Cost:", productcost * quantity);
            // Update the stock in the rowitem collection
            await rowitems.updateOne(
              { name },
              { $set: { stock: updatedStock } }
            );
            const stockData = {
              name,
              quantity,
              unit,
              productCost: productcost * quantity,
              date: new Date(), // Current date and time
            };
            //Insert data into the stock colleciton.
            await stocks.insertOne(stockData);
          } else {
            // Units are different, convert quantity to productperchaseunit and subtract
            const convertedQuantity = this.convertQuantity(
              quantity,
              unit,
              productperchaseunit
            );

            // Subtract the converted quantity from stock
            const updatedStock = stock - convertedQuantity;
            console.log("Product naem:", name);
            console.log("Quantity:", quantity);
            console.log("Unit:", unit);
            console.log("Product Cost:", productcost * convertedQuantity);

            // Update the stock in the rowitem collection
            await rowitems.updateOne(
              { name },
              { $set: { stock: updatedStock } }
            );
            const stockDatadata = {
              name,
              quantity,
              unit,
              productCost: productcost * convertedQuantity,
              date: new Date(), // Current date and time
            };
            //Insert data into the stock collection.
            await stocks.insertOne(stockDatadata);
          }
        } else {
          console.log(`Rowitem not found for product "${name}"`);
        }
      }

      console.log(`Combined quantities for all items:`, combinedItems);
      // Reset variables after processing
      this.resetVariables();

      return result.insertedId;
    } catch (err) {
      console.error(`Error adding sale: ${err}`);
      throw err;
    }
  }

  static async getOrderStatus(orderId) {
    try {
      const order = await orders.findOne({ _id: ObjectId(orderId) });
      return order ? order.orderstatus : null;
    } catch (err) {
      console.error(`Error getting order status: ${err}`);
      throw err;
    }
  }

  static async updateOrderStatus(orderId, newStatus) {
    try {
      const result = await orders.updateOne(
        { _id: ObjectId(orderId) },
        { $set: { orderstatus: newStatus } }
      );

      return result.modifiedCount > 0;
    } catch (err) {
      console.error(`Error updating order status: ${err}`);
      throw err;
    }
  }

  static convertQuantity(quantity, fromUnit, toUnit) {
    // Implement the conversion logic based on your specific units
    // For simplicity, assuming a linear conversion (e.g., grams to kilograms)
    if (fromUnit === "g" && toUnit === "Kg") {
      return parseInt(quantity, 10) / 1000;
    }
    if (fromUnit === "ml" && toUnit === "L") {
      return parseInt(quantity, 10) / 1000;
    }
    // Add more conversion cases as needed

    // Default case (no conversion needed)
    return parseInt(quantity, 10);
  }

  static resetVariables() {
    cumulativeQuantities = {};
  }

  static async getItem() {
    if (!item) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const cursor = await item.find({}).toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async getItempart(pageNumber, itemsPerPage, category) {
    if (!item) {
      throw new Error("DataDAO not initialized");
    }
    try {
      let query = {}; // default query with no category filter
      if (category) {
        query = { category: category }; // add Category filter to the query.
      }
      const skip = (pageNumber - 1) * itemsPerPage;
      const cursor = await item
        .find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async getSale() {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }
    try {
      const cursor = await sale.find({}).toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async getdailyorders(meal) {
    if (!orders) {
      throw new Error("DataDAO not initialized");
    }
    try {
      // Filter orders for today
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}/${month}/${day}`;
      console.log("Today:", formattedDate);

      // Construct the filter based on the date and meal
      const filter = {
        "products.date": formattedDate,
        "products.meal": meal,
      };

      const dayOrders = await orders.find(filter).toArray();

      // Transform and filter the response
      const filteredOrders = dayOrders.map((order) => {
        return {
          _id: order._id,
          customerName: order.customerName,
          customerdetails: order.customerdetails,
          products: order.products.map((product) => ({
            productName: product.productName,
            meal: product.meal,
          })),
          mobileno: order.mobileno,
          orderstatus: order.orderstatus,
          orderId: order.orderId,
        };
      });

      return filteredOrders;
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      return { error: err };
    }
  }

  static async getUserOrders(email) {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }

    try {
      const cursor = await sale.find({ email: email }).toArray();
      return cursor;
    } catch (err) {
      console.error(`Error getting user orders: ${err}`);
      throw err;
    }
  }

  static async getSalesByDate(date) {
    if (!sale) {
      throw new Error("DataDAO not initialized");
    }

    try {
      const pipeline = [
        {
          $match: {
            timestamp: date,
          },
        },
        {
          $unwind: "$products", // Unwind the products array
        },
        {
          $group: {
            _id: "$products.productName", // Group by product name
            totalQuantity: { $sum: "$products.quantity" }, // Sum the quantities for each product
          },
        },
      ];

      const result = await sale.aggregate(pipeline).toArray();
      return result;
    } catch (err) {
      console.error(`Error getting sales by date: ${err}`);
      throw err;
    }
  }
}
