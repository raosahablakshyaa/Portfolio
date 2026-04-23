const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const app = require("./app");
const { connectDatabase } = require("./config/db");
const { ensureDefaultAdmin, seedBaseContent } = require("./utils");

dotenv.config();

async function startServer() {
  const uploadsPath = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  await connectDatabase();
  await ensureDefaultAdmin();
  await seedBaseContent();

  const port = process.env.PORT || 5001;
  const server = app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });

  server.on("error", (error) => {
    console.error(`Server failed on port ${port}`, error);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
