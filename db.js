const mongoose = require("mongoose");
require("dotenv/config");
// mongoose_URI = process.env.DB_KEY;
mongoose_URI='mongodb://127.0.0.1:27017/shristi23'
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
