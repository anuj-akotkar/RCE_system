const mongoose = require("mongoose");
require("dotenv").config();
const { MONGODB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true, // Corrected option name
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection successful");
    })
    .catch((err) => {
      console.log("DB Connection Failed");
      console.log(err);
      process.exit(1);
    });
};