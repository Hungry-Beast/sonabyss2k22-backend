const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    upi: {
      type: String,
    },
    qrCode: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Club", ClubSchema);
