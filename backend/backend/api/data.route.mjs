import express from "express";
import DataController from "./data.controller.mjs";

const router = express.Router();

router.get("/", DataController.getData);
router.get("/items", DataController.getItem);
router.get("/itemscategoryvice", DataController.getItemcategoryvice);
router.get("/itemname", DataController.getItemName);
// router.post("/", DataController.addData);
router.put("/:orderId/update-data", DataController.updateOrderStatus);
router.post("/addsale", DataController.addSale);
router.get("/getsales", DataController.getSale);
router.get("/getorders", DataController.getdailyorders);
router.put("/updatedata", DataController.updateOrderStatus);
router.get("/getuserorders/:email", DataController.getUserOrders);

router.get("/topsellingitems", DataController.getTopSellingItems);

router.get("/itempart", DataController.getItempart);

export default router;
