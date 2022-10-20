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

router.post("/", multer().single("file"), async (req, res) => {
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
      linkedin: req.body.linkedin,
      insta: req.body.insta,
      fb: req.body.fb,
      github: req.body.github

    });
    res.json(organiser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});
router.get("/", async (req, res) => {
  const Developers = await Organisers.find({ group: 1 });
  const Creative_Head = await Organisers.find({ group: 2 });
  const PubAndBrand = await Organisers.find({ group: 3 });
  const StageIncharge = await Organisers.find({ group: 4 });
  const SonabyssIncharge = await Organisers.find({ group: 5 });
  const Hospitality = await Organisers.find({ group: 6 });
  const Media = await Organisers.find({ group: 7 });
  const Org_secy = await Organisers.find({ group: 8 });
  const Auditor = await Organisers.find({ group: 9 });
  const Cosplay = await Organisers.find({ group: 10 });

  res.json([
    Developers, Creative_Head, PubAndBrand, StageIncharge, SonabyssIncharge, Hospitality, Media, Org_secy, Auditor, Cosplay
  ]);
});

module.exports = router;