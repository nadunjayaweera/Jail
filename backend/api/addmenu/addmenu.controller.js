import MenuDAO from "../../dao/addmenuDAO.js";

const apiAddMenu = async (req, res) => {
  try {
    const { menu, items } = req.body;

    const newMenu = {
      menu,
      items,
    };

    const result = await MenuDAO.addMenu(newMenu);

    return res.json({
      message: "Menu added successfully",
      menu: result,
    });
  } catch (e) {
    console.error(`Unable to add menu: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

// Update an existing row item
const apiUpdateMenu = async (req, res) => {
  try {
    const { menu, items } = req.body;

    const { id } = req.params;

    // Create an updated row item object
    const updatedMenu = {
      menu,
      items,
    };

    // Update the row item in the database
    await MenuDAO.updateMenu(id, updatedMenu);

    // Return a success response
    return res.json({ message: "Menu updated successfully" });
  } catch (e) {
    // Handle error
    console.error(`Unable to update Menu: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

const apiGetMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await MenuDAO.getMenuById(id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    return res.json(menu);
  } catch (e) {
    console.error(`Unable to get menu by ID: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

const apiGetAllMenus = async (req, res) => {
  try {
    const menus = await MenuDAO.getAllMenus();

    return res.json(menus);
  } catch (e) {
    console.error(`Unable to get all menus: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

// End point for delete Menu by there ID.
const apiDeleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the menu in the database
    await MenuDAO.deleteMenu(id);

    // Return a success response
    return res.json({ message: "Menu deleted successfully" });
  } catch (e) {
    // Handle error
    console.error(`Unable to delete Menu: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

export default {
  apiAddMenu,
  apiGetMenuById,
  apiGetAllMenus,
  apiUpdateMenu,
  apiDeleteMenu,
};
