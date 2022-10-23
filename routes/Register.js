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

const Register = require("../models/Register");
const Event = require("../models/Event");
const User = require("../models/User");

const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
const TransactionId = require("../models/TransactionId");
// const fetchuser = require("../middleware/fetchuser");

router.post("/", [fetchUser, multer().single("file")], async (req, res) => {
  try {
    let downloadUrl;
    const event = await Event.findById(req.body.eventId);
    if (event.user && event.user.includes(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Already resgistered to this event" });
    }
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
    if(userData&&userData.userType==="o"&&!event.isOpen){
      return res.status(404).json({error:"Not allowed to register"})
    } 
    if (event.disabled) {
      res.status(404).json({ error: "Registration is closed" });
    }
    console.log(event);

    console.log("hi");
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
      isPaid: event.isPaid,
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
  try {
    if (req.body.transactionId) {
      const isAlready = await TransactionId.findOne({
        transactionId: req.body.transactionId,
      });
      const user = await User.findById(req.user.id);
      console.log(isAlready);
      if (isAlready) {
        res.status(400).json({ error: "Transaction Id is not unique" });
        return;
      }
      console.log("Hi");
      const isVerified = await Register.findByIdAndUpdate(req.params.id, {
        verifiedBy: req.user.id,
        verifiedDate: req.body.date,
        isVerified: req.body.isVerified,
      });
      const transactionId = await TransactionId.create({
        regNo: user.regNo,
        transactionId: req.body.transactionId,
        eventId: req.body.eventId,
        eventName: req.body.eventName,
        clubName: req.body.clubName,
      });

      console.log(isVerified);
      if (isVerified) {
        res.status(202).json({ message: "Payment verified...!" });
      } else {
        res.status(402).send({ message: "Payment not verified" });
      }
    } else {
      const isVerified = await Register.findByIdAndUpdate(req.params.id, {
        verifiedBy: req.user.id,
        verifiedDate: req.body.date,
        isVerified: req.body.isVerified,
      });
      res.status(226).send({ message: "Payment rejected...!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Someting Went wrong" });
  }
});

module.exports = router;
