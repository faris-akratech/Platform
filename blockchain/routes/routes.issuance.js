import express from "express";
import * as issuanceController from "../controllers/controller.issuance.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/test", (req, res) => {
  return res.status(200).json({ message: "Issuance server works" });
});

export default router;
