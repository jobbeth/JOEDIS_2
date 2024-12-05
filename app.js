import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Bruges til at simulere __dirname i ESM
import brugerRoutes from "./bruger.routes.js";

const app = express();

// Simuler __dirname i ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gør filerne i 'public' mappen tilgængelige som statiske filer
app.use(express.static(path.join(__dirname, "public")));

// Route til at servere index.html som default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware til at modtage JSON-data
app.use(express.json());

// Database ruter
app.use(brugerRoutes);

// Start serveren
const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
