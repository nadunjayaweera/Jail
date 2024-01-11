import express from "express";
import SignupCtrl from "./signup.controller.js";

const router = express.Router();

router.route("/signup").post(SignupCtrl.apiSignup);
router.route("/login").post(SignupCtrl.apiSignup);

export default router;
