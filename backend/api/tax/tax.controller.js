import TaxesDAO from "../../dao/taxesDAO.js";

export default class TaxController {
  static async apiAddTax(req, res, next) {
    try {
      const { taxName, taxRate, serviceCharge, note } = req.body;
      const result = await TaxesDAO.addTax(
        taxName,
        taxRate,
        serviceCharge,
        note
      );
      if (result.error) {
        throw new Error(result.error);
      }
      res.json({ status: "success", taxId: result.insertedId });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetTaxes(req, res, next) {
    try {
      const taxes = await TaxesDAO.getTaxes();
      res.json({ status: "success", taxes: taxes });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteTax(req, res, next) {
    try {
      const { taxId } = req.params;
      const result = await TaxesDAO.deleteTax(taxId);
      if (result.deletedCount === 0) {
        throw new Error("Tax not found");
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateTax(req, res, next) {
    try {
      const { taxId } = req.params;
      const { taxName, taxRate, serviceCharge, note } = req.body;

      // Add logic to update tax in the database using TaxDAO
      const result = await TaxesDAO.updateTax(taxId, {
        taxName,
        taxRate,
        serviceCharge,
        note,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      res.json({ status: "success", message: "Tax updated successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
