import express from "express";
import RowItemCtrl from "./addrowitem.controller.js";

const router = express.Router();

// Create a new row item
router.post("/addrowitem", RowItemCtrl.apiAddRowItem);

// Update an existing row item
router.put("/updaterowitem/:id", RowItemCtrl.apiUpdateRowItem);

// Delete a row item
router.delete("/deleterowitem/:id", RowItemCtrl.apiDeleteRowItem);

// Get a specific row item by ID
router.get("/getrowitem/:id", RowItemCtrl.apiGetRowItemById);

// Get all row items
router.get("/getallrowitems", RowItemCtrl.apiGetAllRowItems);

export default router;
