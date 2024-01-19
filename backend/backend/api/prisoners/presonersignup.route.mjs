import express from "express";
import PresonnerSignupCtrl from "./presonersignup.controller.js";

const router = express.Router();

router.route("/signup").post(PresonnerSignupCtrl.apiSignup);

router.route("/login").post(PresonnerSignupCtrl.apiLogin);

export default router;
