const express = require("express");
const router = express.Router();
const multer = require("multer");

const Register = require("../models/Register");
const Event = require("../models/Event");
const User = require("../models/User");

const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const TransactionId = require("../models/TransactionId");
const supabase = require("../supabase");
const { getDownloadURL } = require("../utils/helper");
// const fetchuser = require("../middleware/fetchuser");

router.post("/", [fetchUser, multer().single("file")], async (req, res) => {
  try {
    let downloadUrl = '';
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
      const sasToken = process.env.sasToken
      const storageName = 'llm1041430350'
      const blobServiceClient = new BlobServiceClient(`https://${storageName}.blob.core.windows.net/?${sasToken}`)
      // Create a unique name for the blob
      const containerName = 'shristi-images';
      const blobName = v4() + req.file.originalname;


      // Get a reference to a container
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload data to the blob
      await blockBlobClient.upload(req.file.buffer, req.file.buffer.length, metadata)

      downloadUrl = blockBlobClient.url

      //azure upload

    }
    // console.log(req.user)
    const userData = await User.findById(req.user.id);
    // console.log(userData)
    if (userData && userData.userType === "o" && !event.isOpen) {
      return res.status(404).json({ error: "Not allowed to register" });
    }
    if (event.disabled) {
      return res.status(404).json({ error: "Registration is closed" });
    }
    // console.log(event);

    // console.log("hi");
    const register = await Register.create({
      name: userData.name,
      regNo: userData.regNo,
      phoneNo: userData.phoneNo,
      date: req.body.date,
      club: req.body.clubId,
      clubName: req.body.clubName,
      eventId: req.body.eventId,
      eventName: req.body.eventName,
      screenshot: downloadUrl ? downloadUrl : '',
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
  } catch (error) { }
});

router.put("/verify/:id", fetchAdmin, async (req, res) => {
  try {
    if (req.body.transactionId) {
      const isAlready = await TransactionId.findOne({
        transactionId: req.body.transactionId,
      });
      const user = await User.findById(req.user.id);
      // console.log(isAlready);
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
