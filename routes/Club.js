const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const Club = require("../models/Club");

router.post("/", multer().single("file"), async (req, res) => {
  try {
    let metadata = {
      contentType: req.file.mimetype,
      name: req.file.originalname,
    };
    // storage.put(req.file.buffer, metadata);
    // }
    const storageRef = ref(storage, `${req.file.originalname}`);
    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    const ClubData = await Club.create({
      name: req.body.name,
      image: downloadUrl,
      desc: req.body.desc,
    });
    res.json(ClubData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});
