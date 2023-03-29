const mongoose = require("mongoose");
require("dotenv/config");


mongoose_URI = "mongodb://localhost:27017/srishti";
// >>>>>>> development

mongoConnect = async () => {
  //   console.log("hi");
  try {
    await mongoose.connect(mongoose_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
  }, () => {
      console.log("Connected to mongo Successfully!");
    });
  } catch (error) {
    console.log(error);
    console.log("hi")
  }
};
module.exports = mongoConnect;
