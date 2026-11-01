const { port } = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

connectDB()
  .then(() => app.listen(port, () => console.log(`API running on port ${port}`)))
  .catch((e) => { console.error("Failed to start:", e.message); process.exit(1); });
