import { prisma } from "../services/prisma.js";
import {
  allSchemas,
  doesOrganizationExist,
  newSchema,
  schemaExists,
} from "./middlewares/schema.db.js";

export const getAllSchemas = async (req, res) => {
  try {
    const orgId = parseInt(req.params.id, 10);
    const payload = req.body;
    const data = await allSchemas(orgId, payload);
    return res
      .status(200)
      .json({ message: "Retrieved all schemas succesfully", data });
  } catch (err) {
    console.error("Error while retrieving all schemas", err);
    return res
      .status(500)
      .json({ error: "Error while retrieving all schemas" });
  }
};

export const createSchema = async (req, res) => {
  try {
    const { schemaName, schemaVersion, attributes } = req.body;
    const orgId = parseInt(req.params.id, 10);
    const organizationExists = await doesOrganizationExist(orgId);
    if (!organizationExists) {
      return res.status(404).json({ message: "Organization not found" });
    }
    const schemaExist = await schemaExists(schemaName, schemaVersion);
    if (schemaExist.length > 0) {
      return res.status(409).json({ message: "Schema already exists" });
    }
    console.log(schemaName, schemaVersion, attributes);
    await newSchema(schemaName, schemaVersion, attributes, orgId);
    return res.status(200).json({ message: "Schema created succesfully" });
  } catch (err) {
    console.error("Error while creating new schema", err);
    return res.status(500).json({ error: "Error while creating new schema" });
  }
};
