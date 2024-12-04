const express = require("express");
const path = require("path");

const app = express();

// Gør filerne i 'public' mappen tilgængelige som statiske filer
app.use(express.static(path.join(__dirname, "public")));

// Route til at servere index.html som default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start serveren
const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
