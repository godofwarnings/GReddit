const mongoose = require("mongoose");

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
