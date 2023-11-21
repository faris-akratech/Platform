import express from "express";
import * as orgController from "./controller.organization.js";
import { verifyToken } from "./middlewares/verifyToken.js";

const router = express.Router();

router.get("/getAllOrgs", verifyToken, orgController.getAllOrganizations);
router.get("/:id", verifyToken, orgController.specificOrganization);
router.put("/:id", verifyToken, orgController.editOrganization);
router.post("/", verifyToken, orgController.newOrganization);

export default router;