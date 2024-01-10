import express from "express";
import SignupCtrl from "./signup.controller.js";

const router = express.Router();

router.route("/")
    .get(SignupCtrl.apiSignup)
    .post(SignupCtrl.apiSignup);

export default router;
