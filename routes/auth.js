const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET;
//ROUTE1: Creating a user using POST request to api/auth/createUser. No login required
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),//message(2nd part of body) is shown if min length is less than 3
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    body('phoneNo', 'Enter a valid phone number').isLength({ max: 10 }),
], async (req, res) => {
    let success = false
    //if there are errors return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    //Checks if the user with same regNo exists already
    try {
        let user = await User.findOne({ regNo: req.body.regNo })
        if (user) {
            return res.status(400).json({ success, error: "Opps! An user with this regNo already exists." })
        }
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            password: secPassword,
            phoneNo: req.body.phoneNo,
            regNo: req.body.regNo,
        })
        const data = {
            user: {
                id: user.id
            }
        }

        success = true
        const authToken = jwt.sign(data, JWT_SECRET)
        // res.json(user) //sending user as response
        res.json({ success, authToken });
    }
    catch (err) {
        success = false
        console.error(err.message);
        res.status(400).json({ success, error: "Internal error occured" })
    }

})
//ROUTE2: Authenticate a user using POST: api/auth/login . No login required
router.post('/login',
    [body('regNo', 'Enter a valid Registration Number').exists(),
    body('password', "Password cannot be blank").exists()],
    async (req, res) => {
        let success = false
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { regNo, password } = req.body;
        const user = await User.findOne({ regNo })
        try {
            if (!user) {
                return res.status(400).json({ success, error: "Please enter correct credentials!" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            // res.json(user) //sending user as response
            res.json({ success, authToken });
        }
        catch (err) {
            success = false
            console.error(err.message);
            res.status(400).json({ success, error: "Internal error occured" })
        }

    })
//ROUTE3:get logged in user details using POST: api/auth/getuser. Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.send(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal error occured")
    }
}
)

module.exports = router