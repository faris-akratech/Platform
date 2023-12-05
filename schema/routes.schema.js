import express from "express";
import * as schemaController from "./controller.schema.js";
import { verifyToken } from "./middlewares/verifyToken.js";
const router = express.Router();

router.get("/:id", verifyToken, schemaController.getAllSchemas);
router.get(
  "/:name/:id",
  verifyToken,
  schemaController.getSpecificSchemaDetails
);
router.post("/:id", verifyToken, schemaController.createSchema);
router.get("/test", (req, res) => {
  return res.status(200).json({ message: "Main server works" });
});

export default router;
