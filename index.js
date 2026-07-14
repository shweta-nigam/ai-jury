import express from "express";
import apiRouter from "./api.js";
import path from "node:path"
import { fileURLToPath } from "node:url";


const app = express();

app.use(express.json());


const PORT = 3000;

const __filename =  fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// serve frontend 
app.use(express.static(path.join(__dirname, "public")))

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});