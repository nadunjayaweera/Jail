import express from "express";
const router = express.Router();
import { getUsers } from "./users.controller.js";

router.get("/", getUsers);

export default router;
