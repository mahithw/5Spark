const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const calendarRoutes = require("./calendarRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", calendarRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});