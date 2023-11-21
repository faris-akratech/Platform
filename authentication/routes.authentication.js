import express from "express";
import * as authController from "./controller.authentication.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Authentication works" });
});

router.get("/verify", authController.verifyMail)
router.post("/verification-mail", authController.sendVerificationMail)
router.post("/signup", authController.signup)
router.post("/signin", authController.signin);

export default router;
