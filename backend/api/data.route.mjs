import express from "express";
import DataController from "./data.controller.mjs";

const router = express.Router();

router.get("/", DataController.getData);
router.get("/items", DataController.getItem);
router.get("/itemname", DataController.getItemName);
// router.post("/", DataController.addData);
router.put("/:itemId/update-data", DataController.updateData); // Add this line for updating orderStatus
router.post("/addsale", DataController.addSale);
router.get("/getsales", DataController.getSale);
router.put("/updatedata", DataController.updateData);
router.get("/getuserorders/:email", DataController.getUserOrders);
router.get("/sales", DataController.getSalesByDate);
router.get("/itempart", DataController.getItempart);

export default router;
