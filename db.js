const mongoose = require("mongoose");
require("dotenv/config");
mongoose_URI = "mongodb+srv://user:user@cluster0.rpunmcp.mongodb.net/?retryWrites=true&w=majority";
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
