const express = require("express");
const router = express.Router();
const multer = require("multer");

const Club = require("../models/Club");
const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");

const supabase = require("../supabase");
const { getDownloadURL } = require("../utils/helper");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4 } = require("uuid");




router.post("/", [fetchAdmin, multer().single("file")], async (req, res) => {
  try {
    console.log('hi')
    let metadata = {
      contentType: req.file.mimetype,
      name: req.file.originalname,
    };


    //supabse code

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

    // const downloadUrl = getDownloadURL(data.path);
    // console.log(req.user);


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


    // club creation
    const ClubData = await Club.create({
      name: req.body.name,
      image: downloadUrl,
      desc: req.body.desc,
      createdBy: req.user.id,
    });

    res.status(200).json(ClubData);
    // res.status(200).send('uploaded!')
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});
router.delete("/delete/:id", fetchAdmin, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    // console.log(club)
    // return res.status(200)
    const isDeleted = await Club.findByIdAndDelete(req.params.id);
    if (isDeleted) {
      res.status(200).json({
        success: true,
        club: isDeleted,
      });
    } else {
      res.status(404).send("Club not found");
    }
  } catch (error) {
    res.status(404).send("Club not found");
  }
});
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();

    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put(
  "/edit/:id",
  [fetchAdmin, multer().single("file")],
  async (req, res) => {
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
      // console.log(req.user);
      const ClubData = await Club.findByIdAndUpdate(req.params.id, {
        qrCode: downloadUrl,
        phoneNo: req.body.phoneNo,
        upi: req.body.upi,
      });
      res.json(ClubData);
    } catch (error) {
      res.status(500)
    }
  }
);

module.exports = router;
