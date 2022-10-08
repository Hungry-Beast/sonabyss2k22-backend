const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET;
//ROUTE1: Creating a user using POST request to api/auth/createUser. No login required
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("phoneNo", "Enter a valid phone number").isLength({ max: 10 }),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //Checks if the user with same regNo exists already
    try {
      let { regNo, phoneNo } = req.body;
      let user = await User.findOne({ phoneNo });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Opps! user already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        phoneNo: req.body.phoneNo,
        regNo,
        userType: req.body.userType,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      // res.json(user) //sending user as response
      res.json({ success, authToken });
    } catch (err) {
      success = false;
      console.error(err.message);
      res.status(400).json({ success, error: "Internal error occured" });
    }
  }
);
//ROUTE2: Authenticate a user using POST: api/auth/login . No login required
router.post(
  "/login",
  [body("password", "Password cannot be blank").exists()],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { regNo, password, phoneNo } = req.body;
    const obj = regNo ? { regNo: regNo } : { phoneNo: phoneNo };
    // console.log(obj);
    const user = await User.findOne(obj);
    // console.log(user);
    try {
      // console.log(JWT_SECRET);
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please enter correct credentials!" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user) //sending user as response
      res.json({ success, authToken });
    } catch (err) {
      success = false;
      console.error(err.message);
      res.status(400).json({ success, error: "Internal error occured" });
    }
  }
);
//ROUTE3: get the details of the loggen in user using POST: api/auth/getuser. Login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }
});
//ROUTE4: get logged in user details using POST: api/auth/getuser. Login Required
router.post("/getallothers", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.find({ userType: "o" }).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }
});

// get the details of all users in the db
router.post("/getalluser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.find().select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }
});

module.exports = router;
