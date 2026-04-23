const dotenv = require("dotenv");
const { connectDatabase } = require("./config/db");
const { ensureDefaultAdmin, seedBaseContent } = require("./utils");

dotenv.config();

async function run() {
  await connectDatabase();
  await ensureDefaultAdmin();
  await seedBaseContent();
  console.log("Seed completed.");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
