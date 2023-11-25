import express from "express";
import * as ecosystemController from "./controller.ecosystem.js";
import { verifyToken } from "./middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, ecosystemController.getAllEcosystem);

export default router;