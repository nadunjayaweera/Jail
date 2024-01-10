import ItemDAO from "../dao/additemDAO.js";

const apiAddItem = async (req, res) => {
    try {
        const { name, price, description, promotionStatus, image } = req.body;

        // Create new item
        const newItem = {
            name,
            price,
            description,
            promotionStatus,
            image,
        };

        // Save item to database
        const result = await ItemDAO.addItem(newItem);

        // Return success response
        return res.json({ message: "Item added successfully", item: result });
    } catch (e) {
        // Handle error
        console.error(`Unable to add item: ${e}`);
        return res.status(500).send({ error: e.message });
    }
};

const apiUpdateItem = async (req, res) => {
    try {
        const { name, price, description, promotionStatus, image } = req.body;
        const { id } = req.params;

        // Create updated item object
        const updatedItem = {
            name,
            price,
            description,
            promotionStatus,
            image,
        };

        // Update item in the database
        await ItemDAO.updateItem(id, updatedItem);

        // Return success response
        return res.json({ message: "Item updated successfully" });
    } catch (e) {
        // Handle error
        console.error(`Unable to update item: ${e}`);
        return res.status(500).send({ error: e.message });
    }
};

const apiDeleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete item from the database
        await ItemDAO.deleteItem(id);

        // Return success response
        return res.json({ message: "Item deleted successfully" });
    } catch (e) {
        // Handle error
        console.error(`Unable to delete item: ${e}`);
        return res.status(500).send({ error: e.message });
    }
};

export default { apiAddItem, apiUpdateItem, apiDeleteItem };
