import express from "express";
import * as schemaController from "./controller.schema.js";
import { verifyToken } from "./middlewares/verifyToken.js";
const router = express.Router();

router.get("/:id", verifyToken, schemaController.getAllSchemas);
router.post("/:id", verifyToken, schemaController.createSchema);

export default router;
