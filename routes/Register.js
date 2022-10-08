const express = require("express");
const router = express.Router();

const Register = require("../models/Register");
const Event = require("../models/Event");
const User = require("../models/User");

const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
// const fetchuser = require("../middleware/fetchuser");

router.post("/", fetchUser, async (req, res) => {
  try {
    let downloadUrl;
    if (req.file) {
      let metadata = {
        contentType: req.file.mimetype,
        name: req.file.originalname,
      };
      // storage.put(req.file.buffer, metadata);
      // }
      const storageRef = ref(storage, `${req.file.originalname}`);
      const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
      downloadUrl = await getDownloadURL(snapshot.ref);
    }

    const userData = await User.findById(req.user.id);
    const event = await Event.findById(req.body.eventId);
    if (event.user.includes(req.user.id)) {
      return res.status(403).send("Already resgistered to this event");
    }
    const register = await Register.create({
      name: userData.name,
      regNo: userData.regNo,
      phoneNo: userData.phoneNo,
      date: req.body.date,
      club: req.body.clubId,
      clubName: req.body.clubName,
      eventId: req.body.eventId,
      eventName: req.body.eventName,
      screenshot: downloadUrl,
    });

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

router.put("/verify/:id", fetchAdmin, async (req, res) => {
  const isVerified = await Register.findByIdAndUpdate(req.params.id, {
    verifiedBy: req.user.id,
    verifiedDate: req.body.date,
    isVerified: req.body.isVerified,
  });
  console.log(isVerified)
  if(isVerified){
    res.status(202).send("Payment verified...!")
  }
  else{
    res.status(402).send("Payment not verified")
  }
});

module.exports = router;
