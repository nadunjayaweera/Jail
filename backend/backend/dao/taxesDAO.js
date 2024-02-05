import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let taxes;

export default class TaxesDAO {
  static async injectDB(conn) {
    if (taxes) {
      return;
    }
    try {
      taxes = await conn.db(process.env.DATA_BASE_NAME).collection("taxes");
    } catch (e) {
      console.error(`Unable to establish collection handles in TaxesDAO: ${e}`);
    }
  }

  static async addTax(taxName, taxRate, serviceCharge, note) {
    try {
      const count = await taxes.countDocuments();
      const taxId = (count + 1).toString().padStart(3, "0");
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const addDoc = {
        taxId: taxId,
        taxName: taxName,
        taxRate: taxRate,
        serviceCharge: serviceCharge,
        note: note,
        createDate: currentDate,
      };
      return await taxes.insertOne(addDoc);
    } catch (e) {
      console.error(`Unable to add tax: ${e}`);
      return { error: e };
    }
  }

  static async getTaxes() {
    try {
      return await taxes.find().toArray();
    } catch (e) {
      console.error(`Unable to get taxes: ${e}`);
      return null;
    }
  }

  static async deleteTax(taxId) {
    try {
      return await taxes.deleteOne({ _id: ObjectId(taxId) });
    } catch (e) {
      console.error(`Unable to delete tax: ${e}`);
      throw new Error(`Unable to delete tax: ${e.message}`);
    }
  }

  static async updateTax(taxId, updatedFields) {
    try {
      const filter = { _id: ObjectId(taxId) };
      const updateDoc = {
        $set: updatedFields,
      };

      const result = await taxes.updateOne(filter, updateDoc);

      if (result.matchedCount === 0) {
        return { error: "Tax not found" };
      }

      return { success: "Tax updated successfully" };
    } catch (e) {
      console.error(`Unable to update tax: ${e}`);
      return { error: e };
    }
  }
}
