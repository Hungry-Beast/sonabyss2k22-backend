const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const storage = getStorage();

const Event = require("../models/Event");
const fetchuser = require("../middleware/fetchuser");
const { async } = require("@firebase/util");
// const { events } = require("../models/Event");

router.post("/", [fetchuser, multer().single("file")], async (req, res) => {
  try {
    if (!req.file) {
      res.send("Please insert a image");
      return;
    }
    let metadata = {
      contentType: req.file.mimetype,
      name: req.file.originalname,
    };
    // storage.put(req.file.buffer, metadata);
    // }
    const storageRef = ref(storage, `${req.file.originalname}`);
    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log("hi");
    const EventData = await Event.create({
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      club: req.body.clubId,
      clubName: req.body.clubName,
      image: downloadUrl,
      desc: req.body.desc,
    });
    res.json(EventData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});
router.get("/:id", fetchuser, async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  const events = await Event.find({ club: id });
  const resEvents = [];
  events.map((event) => {
    resEvents.push({
      id: event._id,
      name: event.name,
      date: event.date,
      time: event.time,
      club: event.clubId,
      clubName: event.clubName,
      image: event.image,
      desc: event.desc,
      isRegistered: event.user.includes(req.user.id),
      clubName: event.clubName,
      club: event.club,
    });
  });
  res.json(resEvents);
});

module.exports = router;
