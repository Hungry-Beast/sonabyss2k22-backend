const express = require("express");

const router = express.Router();
const wbm = require("wbm");
const Register = require("../models/Register");

const accountSid = "ACbeea18e2dff0b5a8cd5444abc090c07e";
const authToken = "[Redacted]";
const client = require("twilio")(accountSid, authToken);

router.post("/:id", async (req, res) => {
  const registeration = await Register.find({ eventId: req.params.id });
  // console.log(registeration);
  let contacts = [];
  registeration.map((re) => {
    contacts.push({
      phone: "91" + re.phoneNo,
      name: re.name,
    });
  });
  console.log(contacts)
  wbm
    .start()
    .then(async () => {
      const phones = ["919365722389"];
      const message = "Ki hoi asa o";
      await wbm.send(contacts, message);
      await wbm.end();
      res.status(200).send("Message sent successfully");
    })
    .catch((err) => console.log(err));
}); ``
module.exports = router;
