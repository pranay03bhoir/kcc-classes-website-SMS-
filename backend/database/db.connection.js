const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "kcc",
    });
    console.log("Connected to DB");
  } catch (e) {
    console.error("Connection to DB failed ", e);
  }
};

module.exports = connectToDb;
