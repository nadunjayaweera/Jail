import RowItemDAO from "../../dao/addrowitemDAO.js";

// Create a new row item
const apiAddRowItem = async (req, res) => {
  try {
    const {
      name,
      productcost,
      stockalert,
      productunit,
      productsaleunit,
      productperchaseunit,
      stock,
    } = req.body;

    // Create a new row item object
    const newRowItem = {
      name,
      productcost,
      stockalert,
      productunit,
      productsaleunit,
      productperchaseunit,
      stock,
    };

    // Save the new row item to the database
    const result = await RowItemDAO.addRowItem(newRowItem);

    // Return a success response
    return res.json({
      message: "Row item added successfully",
      rowitem: result,
    });
  } catch (e) {
    // Handle error
    console.error(`Unable to add row item: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

// Update an existing row item
const apiUpdateRowItem = async (req, res) => {
  try {
    const {
      name,
      productcost,
      stockalert,
      productunit,
      productsaleunit,
      productperchaseunit,
      stock,
    } = req.body;
    const { id } = req.params;

    // Create an updated row item object
    const updatedRowItem = {
      name,
      productcost,
      stockalert,
      productunit,
      productsaleunit,
      productperchaseunit,
      stock,
    };

    // Update the row item in the database
    await RowItemDAO.updateRowItem(id, updatedRowItem);

    // Return a success response
    return res.json({ message: "Row item updated successfully" });
  } catch (e) {
    // Handle error
    console.error(`Unable to update row item: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

// Delete a row item
const apiDeleteRowItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the row item from the database
    await RowItemDAO.deleteRowItem(id);

    // Return a success response
    return res.json({ message: "Row item deleted successfully" });
  } catch (e) {
    // Handle error
    console.error(`Unable to delete row item: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

// Get a specific row item by ID
const apiGetRowItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the row item by ID from the database
    const rowItem = await RowItemDAO.getRowItemById(id);

    if (!rowItem) {
      return res.status(404).json({ message: "Row item not found" });
    }

    // Return the row item
    return res.json(rowItem);
  } catch (e) {
    // Handle error
    console.error(`Unable to get row item by ID: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

// Get all row items
const apiGetAllRowItems = async (req, res) => {
  try {
    // Get all row items from the database
    const rowItems = await RowItemDAO.getAllRowItems();

    // Return the list of row items
    return res.json(rowItems);
  } catch (e) {
    // Handle error
    console.error(`Unable to get all row items: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

export default {
  apiAddRowItem,
  apiUpdateRowItem,
  apiDeleteRowItem,
  apiGetRowItemById,
  apiGetAllRowItems,
};
