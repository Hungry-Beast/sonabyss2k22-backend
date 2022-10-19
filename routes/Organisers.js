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
const Organisers = require("../models/Organisers");

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
    const organiser = await Organisers.create({
      name: req.body.name,
      regNo: req.body.regNo,
      image: downloadUrl,
      group: req.body.group,    
      position: req.body.position,
    });
    res.json(organiser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});
router.get("/", async (req, res) => {
  const organiser1 = await Organisers.find({ group: 1 });
  const organiser2 = await Organisers.find({ group: 1 });

  res.json([
    { group: 1, organisers1 },
    { group: 2, organiser2 },
  ]);
});

module.exports = router;