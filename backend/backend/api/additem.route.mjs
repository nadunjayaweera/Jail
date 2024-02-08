import express from "express";
import AddItemCtrl from "./additem.controller.js";

const router = express.Router();

// Create a new item
router.post("/additem", AddItemCtrl.apiAddItem);

// Update an existing item
router.put("/updateproduct/:id", AddItemCtrl.apiUpdateItem);

// Delete an item
router.delete("/deleteitem/:id", AddItemCtrl.apiDeleteItem);

export default router;
