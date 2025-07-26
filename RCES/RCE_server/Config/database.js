const mongoose = require("mongoose");
require("dotenv").config();
const { MONGODB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL || "mongodb://localhost:27017/rce_server", {
      useNewUrlParser: true, // Corrected option name
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection successful");
    })
    .catch((err) => {
      console.log("DB Connection Failed - continuing without database");
      console.log(err);
      // Don't exit the process, just log the error
    });
};