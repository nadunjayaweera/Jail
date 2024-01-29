import express from "express";
import TaxCtrl from "./tax.controller.js";

const router = express.Router();

router.route("/addTax").post(TaxCtrl.apiAddTax);
router.route("/getTaxes").get(TaxCtrl.apiGetTaxes);
router.route("/deleteTax/:taxId").delete(TaxCtrl.apiDeleteTax);
router.route("/updateTax/:taxId").put(TaxCtrl.apiUpdateTax);

export default router;
