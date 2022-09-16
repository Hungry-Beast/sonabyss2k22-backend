const express = require("express");
const router = express.Router();

const Register = require("../models/Register");
const Event = require("../models/Event");
const User = require("../models/User");

const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
// const fetchuser = require("../middleware/fetchuser");

router.post("/", fetchUser, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id);
    const register = await Register.create({
      name: userData.name,
      regNo: userData.regNo,
      phoneNo: userData.phoneNo,
      date: req.body.date,
      club: req.body.clubId,
      clubName: req.body.clubName,
      eventId: req.body.eventId,
      eventName: req.body.eventName,
    });
    const event = await Event.findById(req.body.eventId);
    // console.log(event);
    event.user.push(req.user.id);
    await event.save();
    res.json(register);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});

router.get("/:id", fetchAdmin, async (req, res) => {
  try {
    const registeration = await Register.find({ eventId: req.params.id });
    res.json(registeration);
  } catch (error) {}
});
module.exports = router;
