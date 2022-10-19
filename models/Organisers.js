const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrganiserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Organisers", OrganiserSchema);
