import express from "express";
import * as ecosystemController from "./controller.ecosystem.js";
import { verifyToken } from "./middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, ecosystemController.getAllEcosystem);
router.get("/test", (req, res) => {
  return res.status(200).json({ message: "Main server works" });
});

export default router;
