const mongoose = require("mongoose");

async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection;
}

module.exports = { connectDatabase };
