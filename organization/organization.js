import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import orgRoutes from "./routes.organization.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.ORG_SERVER || 3002;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(logger("dev"));
app.use("/organization", orgRoutes);

app.use((err, req, res, next) => {
  console.error("Error finding route within organization.js");
  res.status(500).json({ error: "Error finding route within organization.js" });
});

app.listen(port, () => {
  console.info(`Organization service is running on port ${port}`);
});
