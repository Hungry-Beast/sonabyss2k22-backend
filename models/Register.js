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
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    date: {
      type: String,
      required,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required,
    },
    clubName: {
      type: String,
      required,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required,
    },
    eventName: {
      type: String,
      required,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Event", UserSchema);
