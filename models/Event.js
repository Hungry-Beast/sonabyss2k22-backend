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
      type: String,
      required,
    },
    image: {
      type: String,
      required,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Event", UserSchema);
