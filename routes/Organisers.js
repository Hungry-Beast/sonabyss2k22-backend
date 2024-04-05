const express = require("express");
const router = express.Router();
const multer = require("multer");

const Event = require("../models/Event");
const Register = require("../models/Register");
const fetchuser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const User = require("../models/User");
const Organisers = require("../models/Organisers");
const supabase = require("../supabase");
const { getDownloadURL } = require("../utils/helper");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4 } = require("uuid");

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
    // const { data, error } = await supabase.storage
    //   .from("srishti")
    //   .upload(`${req.body.name}-${req.file.originalname}`, req.file.buffer, {
    //     cacheControl: "3600",
    //     upsert: true,
    //   });
    // if (error) {
    //   console.error("Error uploading file:", error.message);
    //   throw new Error(error.message);
    // }



    //azure upload
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

    const downloadUrl = blockBlobClient.url


    // const downloadUrl = getDownloadURL(data.path);
    const organiser = await Organisers.create({
      name: req.body.name,
      regNo: req.body.regNo,
      image: downloadUrl,
      group: req.body.group,
      position: req.body.position,
      linkedin: req.body.linkedin,
      insta: req.body.insta,
      fb: req.body.fb,
      github: req.body.github,
    });
    res.json(organiser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});
router.get("/", async (req, res) => {
  // const Developers = await Organisers.find({ group: 1 });
  // const Creative_Head = await Organisers.find({ group: 2 });
  // const PubAndBrand = await Organisers.find({ group: 3 });
  // const StageIncharge = await Organisers.find({ group: 4 });
  // const SonabyssIncharge = await Organisers.find({ group: 5 });
  // const Hospitality = await Organisers.find({ group: 6 });
  // const Media = await Organisers.find({ group: 7 });
  // const Org_secy = await Organisers.find({ group: 8 });
  // const Auditor = await Organisers.find({ group: 9 });
  // const Cosplay = await Organisers.find({ group: 10 });
  try {
    const organisers = await Organisers.find()
    res.status(200).json(organisers);

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
