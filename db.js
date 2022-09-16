const mongoose = require("mongoose");
require("dotenv/config");
mongoose_URI = process.env.LOCAL_DB_KY;
mongoConnect = async () => {
//   console.log("hi");
  try {
    await mongoose.connect(mongoose_URI, () => {
      console.log("Connected to mongo Successfully!");
    });
  } catch (error) {
    console.error();
    console.log("hi")
  }
};
module.exports = mongoConnect;
