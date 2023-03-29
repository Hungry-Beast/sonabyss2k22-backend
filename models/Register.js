const mongoose = require("mongoose");
const { Schema } = mongoose;

const RegisterSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    names: {
      type: Array,
    },
    isTeamEvent: {
      type: Boolean,
      default: false,
    },
    regNo: {
      type: String,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    clubName: {
      type: String,
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    screenshot: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedDate: {
      type: String,
    },
    isVerified: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Register", RegisterSchema);
