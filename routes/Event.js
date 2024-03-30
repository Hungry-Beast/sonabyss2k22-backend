const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
// const app=require('../firebaseAuth')
const storage = getStorage();

const Event = require("../models/Event");
const Register = require("../models/Register");
const fetchuser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const User = require("../models/User");
const Club = require("../models/Club");
// const { events } = require("../models/Event");

router.post("/", [fetchAdmin, multer().single("file")], async (req, res) => {
  try {
    if (!req.file) {
      res.status(206).send("Please insert a image");
      return;
    }
    // let metadata = {
    //   contentType: req.file.mimetype,
    //   name: req.file.originalname,
    // };
    // console.log(req.file)
    // storage.put(req.file.buffer, metadata);
    // }
    const storageRef = ref(storage, `/abc`);
    // const snapshot = await uploadBytes(storageRef, req.file.buffer);
    const bytes = new Uint8Array([
      0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64,
      0x21,
    ]);
    const snapshot = await uploadBytes(storageRef, bytes)

    console.log(snapshot);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    const EventData = await Event.create({
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      club: req.body.clubId,
      clubName: req.body.clubName,
      image: "ajja",
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
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500);
  }
});

router.get("/admin/noAuth/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const events = await Event.find({ club: id });
    // const resPreEvents = [];
    // const resMainEvents = [];
    // events.map((event) => {
    //   event.isMainEvent || true
    //     ? resMainEvents.push(event)
    //     : resPreEvents.push(event);
    // });
    res.status(200).json(events);
  } catch (error) {
    res.status(500);
  }
});
router.get("/noAuth/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const events = await Event.find({ club: id });
    const resPreEvents = [];
    const resMainEvents = [];
    events.map((event) => {
      event.isMainEvent ? resMainEvents.push(event) : resPreEvents.push(event);
    });
    res.status(200).json([resPreEvents, resMainEvents]);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
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
    let club = await Club.findById(id);
    console.log(club);
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
            disabled:
              (outsider && !event.isOpen ? true : false) ||
              (event.disabled ? true : false),
            isPaid: event.isPaid,
            price: outsider ? event.priceO : event.priceN,
            qrCode: event.isPaid ? club.qrCode : null,
            upi: event.isPaid ? club.upi : null,
            phoneNo: event.isPaid ? club.phoneNo : null,
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
            disabled:
              (outsider && !event.isOpen ? true : false) ||
              (event.disabled ? true : false),
            isPaid: event.isPaid,
            price: outsider ? event.priceO : event.priceN,
            qrCode: event.isPaid ? club.qrCode : null,
            upi: event.isPaid ? club.upi : null,
            phoneNo: event.isPaid ? club.phoneNo : null,
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
      res.status(200).json({ event: isDeleted });
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Event not found...");
  }
});

router.put(
  "/edit/:id",
  [fetchAdmin, multer().single("file")],
  async (req, res) => {
    let downloadUrl;
    const newEvent = {};
    try {
      if (req.file) {
        let metadata = {
          contentType: req.file.mimetype,
          name: req.file.originalname,
        };
        const storageRef = ref(storage, `${req.file.originalname}`);
        const snapshot = await uploadBytes(
          storageRef,
          req.file.buffer,
          metadata
        );
        const downloadUrl = await getDownloadURL(snapshot.ref);
        newEvent.image = downloadUrl;
      }

      console.log(req.body);

      if (req.body.name) newEvent.name = req.body.name;
      if (req.body.date) newEvent.date = req.body.date;
      if (req.body.time) newEvent.time = req.body.time;
      if (req.body.clubId) newEvent.club = req.body.clubId;
      if (req.body.clubName) newEvent.clubName = req.body.clubName;
      if (req.body.desc) newEvent.desc = req.body.desc;
      if (req.body.date) newEvent.date = req.body.date;
      if (req.body.time) newEvent.time = req.body.time;
      if (req.body.duration) newEvent.duration = req.body.duration;
      if (req.body.venue) newEvent.venue = req.body.venue;
      if (req.body.isOpen) newEvent.isOpen = req.body.isOpen;
      if (req.body.isPaid) newEvent.isPaid = req.body.isPaid;
      if (req.body.priceO)
        newEvent.priceO = req.body.priceO ? req.body.priceO : "";
      if (req.body.priceN)
        newEvent.priceN = req.body.priceN ? req.body.priceN : "";
      if (req.body.isMainEvent) newEvent.isMainEvent = req.body.isMainEvent;

      const event = await Event.findById(req.params.id);
      if (!event) throw "Event Not found!";
      console.log(req.params.id, newEvent);

      const editedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { $set: newEvent },
        { new: true }
      );
      res.json(editedEvent);
      console.log("success", editedEvent);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);
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
    console.log(event.isMainEvent);
    const club = await Club.findById(event.club);

    // console.log(club)
    // if (!registeration) {
    //   res.status(206).json({ error: "Please give a valid registration id" });
    // }
    console.log(registeration);
    // const resEvents = [];
    // events.map((event) => {
    const result = {
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
      disabled:
        (outsider && !event.isOpen ? true : false) ||
        (event.disabled ? true : false),
      isPaid: event.isPaid,
      price: outsider ? event.priceO : event.priceN,
      isVerified: registeration?.isVerified,
      isMainEvent: event.isMainEvent,
      qrCode: club.qrCode,
      upi: club.upi,
      phoneNo: club.phoneNo,
      isMainEvent: event.isMainEvent,
    };

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/event/noAuth/:id", async (req, res) => {
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
    const club = await Club.findById(event.club);
    const result = {
      id: event._id,
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
      phoneNo: club.phoneNo,
      isMainEvent: event.isMainEvent,
    };

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/disable/:id", fetchAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, {
      disabled: true,
    });
    res.send("Disabled");
  } catch (error) {
    res.status(404).status({ error: "Something went crazy" });
  }
});

// router.get('/getalldetails/:id', async (req, res) => {
//   try {
//     const id = req.params.id
//     console.log(id)
//     if (!id) {
//       {
//         res.status(206).json({ error: "Please give a valid event id" });
//       }
//       const event = await Event.find({ club: id })
//       console.log(event)
//       if (!event) {
//         res.status(206).json({ error: "Please give a valid event id" });
//       }
//       res.json(event);
//       console.log('called')
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// })

module.exports = router;
