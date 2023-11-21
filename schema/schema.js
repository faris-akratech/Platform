import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import schemaRoutes from "./routes.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(logger("dev"));
app.use("/schema", schemaRoutes);

app.use((err, req, res, next) => {
  console.error("Error finding route within organization.js");
  res.status(500).json({ error: "Error finding route within schema.js" });
});

app.listen(port, () => {
  console.log(`Schema service is running on port ${port}`);
});
