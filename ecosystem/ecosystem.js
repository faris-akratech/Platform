import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import ecosystemRoute from "./routes.ecosystem.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3004;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(logger("dev"));
app.use("/ecosystem", ecosystemRoute);

app.use((err, req, res, next) => {
  console.error("Error finding route within ecosystem.js");
  res.status(500).json({ error: "Error finding route within ecosystem.js" });
});

app.listen(port, () => {
  console.log(`Ecosystem service is running on port ${port}`);
});
