import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import { checkToken } from "./services/checkToken.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.get("/", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const iv = req.headers["value"];
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    if (checkToken(token, iv))
      return res.status(200).json({ message: "User is active" });
    else return res.status(403).json({ message: "Invalid or expired session" });
  }
  return res.status(401).json({ message: "Session not initialised" });
});

// Forward request to authentication server
app.all("/auth/*", async (req, res) => {
  const path = req.url.replace(/\/+/g, "/");
  const server = `${process.env.AUTH_SERVER}${path}/`;
  try {
    const method = req.method.toLowerCase();
    const response = await axios({
      method,
      url: server,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error forwarding request to authentication server");
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.message
        ? err.response.data.message
        : "Error forwarding request to authentication server",
    });
  }
});

// Forward request to organization server
app.all("/organization/*", async (req, res) => {
  const path = req.url.replace(/\/+/g, "/");
  const server = `${process.env.ORG_SERVER}${path}/`;
  const data = { ...req.body, ...req.headers };
  const method = req.method.toLowerCase();
  try {
    const response = await axios({
      url: server,
      method,
      data: data,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error forwarding request to organization server");
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.message
        ? err.response.data.message
        : "Error forwarding request to organization server",
    });
  }
});

// Forward request to schema server
app.all("/schema/*", async (req, res) => {
  const path = req.url.replace(/\/+/g, "/");
  const server = `${process.env.SCHEMA_SERVER}${path}/`;
  const data = { ...req.body, ...req.headers };
  try {
    const method = req.method.toLowerCase();
    const response = await axios({
      method,
      url: server,
      data: data,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error forwarding request to schema server");
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.message
        ? err.response.data.message
        : "Error forwarding request to schema server",
    });
  }
});

// Forward request to ecosystem server
app.all("/ecosystem/*", async (req, res) => {
  const path = req.url.replace(/\/+/g, "/");
  const server = `${process.env.ECOSYSTEM_SERVER}${path}/`;
  const data = { ...req.body, ...req.headers };
  try {
    const method = req.method.toLowerCase();
    const response = await axios({
      method,
      url: server,
      data: data,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error forwarding request to ecosystem server");
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.message
        ? err.response.data.message
        : "Error forwarding request to ecosystem server",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
