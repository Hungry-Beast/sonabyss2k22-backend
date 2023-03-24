const mongoose = require("mongoose");
require("dotenv/config");
mongoose_URI = process.env.DB_KEY;
mongoConnect = async () => {
  //   console.log("hi");
  try {
    await mongoose.connect(mongoose_URI, () => {
      console.log("Connected to mongo Successfully!");
    });
  } catch (error) {
    console.log(error);
    console.log("hi")
  }
};
module.exports = mongoConnect;
