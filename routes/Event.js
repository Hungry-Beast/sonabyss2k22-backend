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
const Register = require("../models/Register");
const fetchuser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const { async } = require("@firebase/util");
const User = require("../models/User");
// const { events } = require("../models/Event");

router.post("/", [fetchAdmin, multer().single("file")], async (req, res) => {
  try {
    if (!req.file) {
      res.status(206).send("Please insert a image");
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
    // console.log("hi");
    const EventData = await Event.create({
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      club: req.body.clubId,
      clubName: req.body.clubName,
      image: downloadUrl,
      desc: req.body.desc,
      date: req.body.date,
      time: req.body.time,
      duration: req.body.duration,
      venue: req.body.venue,
      isOpen: req.body.isOpen,
      createdBy: req.user.id,
      isPaid: req.body.isPaid,
      priceO: req.body.priceO ? req.body.priceO : "",
      priceN: req.body.priceN ? req.body.priceN : "",
      isMainEvent: req.body.isMainEvent,
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

router.get("/noAuth/:id", async (req, res) => {
  const id = req.params.id;
  const events = await Event.find({ club: id });
  const resPreEvents = [];
  const resMainEvents = [];
  events.map((event) => {
    event.isMainEvent ? resMainEvents.push(event) : resPreEvents.push(event);
  });
  res.status(200).json([resPreEvents, resMainEvents]);
});

router.get("/:id", fetchuser, async (req, res) => {
  // console.log(req.params);
  try {
    const id = req.params.id;
    const user = await User.findById(req.user.id);
    const outsider = user.userType === "o";
    console.log(outsider);
    if (!id) {
      res.status(206).json({ error: "Please give a valid club id" });
    }
    const events = await Event.find({ club: id });
    const resPreEvents = [];
    const resMainEvents = [];
    events.map((event) => {
      event.isMainEvent
        ? resMainEvents.push({
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
            venue: event.venue,
            club: event.club,
            disabled: outsider && !event.isOpen ? true : false,
            isPaid: event.isPaid,
            price: outsider ? event.priceO : event.priceN,
          })
        : resPreEvents.push({
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
            venue: event.venue,
            club: event.club,
            disabled: outsider && !event.isOpen ? true : false,
            isPaid: event.isPaid,
            price: outsider ? event.priceO : event.priceN,
          });
    });
    res.json([resPreEvents, resMainEvents]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", fetchAdmin, async (req, res) => {
  try {
    let isDeleted = await Event.findByIdAndDelete(req.params.id);
    // console.log(req.params.id)

    // console.log(isDeleted);
    if (isDeleted) {
      res.status(200).send("Event deleted....!");
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Event not found...");
  }
});

router.get("/event/:id", fetchuser, async (req, res) => {
  // console.log(req.params);
  try {
    const id = req.params.id;
    const user = await User.findById(req.user.id);
    const outsider = user.userType === "o";
    if (!id) {
      res.status(206).json({ error: "Please give a valid event id" });
    }
    const event = await Event.findById(id);
    if (!event) {
      res.status(206).json({ error: "Please give a valid event id" });
    }

    const registeration = await Register.findOne({
      eventId: id,
      regNo: user.regNo,
    });
    // if (!registeration) {
    //   res.status(206).json({ error: "Please give a valid registration id" });
    // }
    console.log(registeration);
    // const resEvents = [];
    // events.map((event) => {
    const result = {
      _id: event._id,
      name: event.name,
      date: event.date,
      time: event.time,
      club: event.clubId,
      clubName: event.clubName,
      image: event.image,
      desc: event.desc,
      isRegistered: event.user.includes(req.user.id),
      clubName: event.clubName,
      venue: event.venue,
      club: event.club,
      disabled: outsider && !event.isOpen ? true : false,
      isPaid: event.isPaid,
      price: outsider ? event.priceO : event.priceN,
      isVerified: registeration?.isVerified,
    };

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/event/noAuth/:id", fetchuser, async (req, res) => {
  // console.log(req.params);
  try {
    const id = req.params.id;
    // const user = await User.findById(req.user.id);
    // const outsider = user.userType === "o";
    if (!id) {
      res.status(206).json({ error: "Please give a valid event id" });
    }
    const event = await Event.findById(id);
    if (!event) {
      res.status(206).json({ error: "Please give a valid event id" });
    }

    // const registeration = await Register.findOne({ eventId: id,regNo:user.regNo });
    // if (!registeration) {
    //   res.status(206).json({ error: "Please give a valid registration id" });
    // }
    // console.log(registeration)
    // const resEvents = [];
    // events.map((event) => {
    const result = {
      _id: event._id,
      name: event.name,
      date: event.date,
      time: event.time,
      club: event.clubId,
      clubName: event.clubName,
      image: event.image,
      desc: event.desc,
      clubName: event.clubName,
      venue: event.venue,
      club: event.club,
      isPaid: event.isPaid,
      price: event.priceN,
    };

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
