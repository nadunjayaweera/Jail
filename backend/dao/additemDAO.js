import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;
let currentItemID = 0; // Intialize the conter
let items;

export default class ItemDAO {
  static async injectDB(conn) {
    if (items) {
      return;
    }
    try {
      items = await conn.db(process.env.DATA_BASE_NAME).collection("item");
    } catch (e) {
      console.error(`Unable to establish collection handles in ItemDAO: ${e}`);
    }
  }

  static async addItem(item) {
    if (!items) {
      throw new Error("DataDAO not initialized");
    }
    try {
      // Find the item with the maximum itemid
      const maxItem = await items.findOne({}, { sort: { itemid: -1 } });

      // Determine the next itemid
      const nextItemId = maxItem ? maxItem.itemid + 1 : 1;

      // Add the itemid field to the item object
      const newItem = {
        ...item,
        itemid: nextItemId,
      };

      const result = await items.insertOne(newItem);
      const insertedItem = result.ops[0];
      return insertedItem;
    } catch (err) {
      console.error(`Error adding item: ${err}`);
      throw err;
    }
  }

  static async deleteItem(id) {
    if (!items) {
      throw new Error("ItemDAO not initialized");
    }
    try {
      await items.deleteOne({ _id: ObjectId(id) });
    } catch (err) {
      console.error(`Error deleting item: ${err}`);
      throw err;
    }
  }

  static async updateItem(id, updatedItem) {
    if (!items) {
      throw new Error("ItemDAO not initialized");
    }
    try {
      await items.updateOne({ _id: ObjectId(id) }, { $set: updatedItem });
    } catch (err) {
      console.error(`Error updating item: ${err}`);
      throw err;
    }
  }

  static async getItemById(id) {
    try {
      return await items.findOne({ _id: ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get item: ${e}`);
      return null;
    }
  }
}
