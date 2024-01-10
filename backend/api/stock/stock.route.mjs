import express from "express";
import StockController from "./stock.controller.mjs";
const router = express.Router();
router.get("/stock", StockController.getStockData);
export default router;
