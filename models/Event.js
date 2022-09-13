const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique,
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
module.exports = mongoose.model("Event", EventSchema);
