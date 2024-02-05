import express from "express";
const router = express.Router();
import { getUsers } from "./users.controller.js";
import { getUserDetails } from "./users.controller.js";
router.get("/", getUsers);
router.get("/details", getUserDetails);

export default router;
