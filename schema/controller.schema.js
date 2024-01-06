import axios from "axios";
import { prisma } from "../services/prisma.js";
import {
  allSchemas,
  doesOrganizationExist,
  getSpecificSchema,
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

export const getSpecificSchemaDetails = async (req, res) => {
  try {
    const orgId = parseInt(req.params.id, 10);
    const name = req.params.name;
    const data = await getSpecificSchema(name, orgId);
    if (!data) {
      res.status(404).json({ message: "Could not find the specific schema" });
    }
    res
      .status(200)
      .json({ message: "Retrieved schema details succesfully", data });
  } catch (err) {
    console.error("Error while retrieving schema details", err);
    return res
      .status(500)
      .json({ error: "Error while retrieving schema details" });
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
    await newSchema(schemaName, schemaVersion, attributes, orgId)
    const data = { schemaName, schemaVersion, attributes };
    const response = await axios.post(`${process.env.INDY_SERVER}/government_transcript_schema`, data);
    if (response.status === 200) {
      return res.status(200).json({ message: "Schema created successfully" });
    } else {
      return res.status(response.status).json({ message: "Error creating schema on ledger" });
    }
  } catch (err) {
    console.error("Error while creating new schema", err);
    return res.status(500).json({ error: "Error while creating new schema" });
  }
};
