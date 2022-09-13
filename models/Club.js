const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique,
    },

    image: {
      type: String,
      required,
    },
    desc: {
      type: String,
      required,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Club", ClubSchema);
