const express = require("express");
const router = express.Router();

const Register = require("../models/Register");
const Event = require("../models/Event");
const User = require("../models/User");

const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
// const fetchuser = require("../middleware/fetchuser");

router.post("/", fetchUser, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id);
    const register = await Register.create({
      name: userData.name,
      regNo: userData.regNo,
      phoneNo: userData.phoneNo,
      date: req.body.date,
      club: req.body.clubId,
      clubName: req.body.clubName,
      eventId: req.body.eventId,
      eventName: req.body.eventName,
    });
    const event = await Event.findById(req.body.eventId);
    // console.log(event);
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

router.get("/getPdf/:id", fetchAdmin, async (req, res) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const employees = [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Anna", lastName: "Smith" },
    { firstName: "Peter", lastName: "Jones" },
  ];
  const document = {
    content: [{ text: "Employees", fontStyle: 15, lineHeight: 2 }],
  };
  employees.forEach((employee) => {
    document.content.push({
      columns: [
        { text: "firstname", width: 60 },
        { text: ":", width: 10 },
        { text: employee.firstName, width: 50 },
        { text: "lastName", width: 60 },
        { text: ":", width: 10 },
        { text: employee.lastName, width: 50 },
      ],
      lineHeight: 2,
    });
  });
  // pdfMake.createPdf(document).download();
  const pdfDocGenerator = pdfMake.createPdf(document);
  pdfDocGenerator.getBuffer((blob) => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline;filename=yolo.pdf");
    // res.contentType("application/pdf");
    res.send(blob);
  });
});
module.exports = router;
