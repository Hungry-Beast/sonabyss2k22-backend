const express = require("express");

const router = express.Router();

const accountSid = "ACbeea18e2dff0b5a8cd5444abc090c07e";
const authToken = "[Redacted]";
const client = require("twilio")(accountSid, authToken);

router.post("/", (req, res) => {
  const accountSid = "ACbeea18e2dff0b5a8cd5444abc090c07e";
  const authToken = "d6f6b8f8209bda6bb54ff0607e299382";
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: "Hello! This is an editable text message. You are free to change it and write whatever you like.",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+918486919537",
    })
    .then((message) => console.log(message.sid))
    .done();
});
module.exports = router;
