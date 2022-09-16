const mongoose = require("mongoose");
const { Schema } = mongoose;

const RegisterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true
    },
    phoneNo: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required:true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required:true,
    },
    clubName: {
      type: String,
      required:true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required:true,
    },
    eventName: {
      type: String,
      required:true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Register", RegisterSchema);
