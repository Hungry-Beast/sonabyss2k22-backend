const express = require("express");
const app = express();
const cors = require("cors");
require("./firebaseAuth");
const mongoConnect = require("./db");
const Club = require("./routes/Club");
const Event = require("./routes/Event");
const Register = require("./routes/Register");
const SendMessage=require('./routes/SendMessage')
// require('./routes/Test')
var bodyParser = require('body-parser')
mongoConnect();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors());
app.use("/clubs", Club);
app.use("/events", Event);
app.use("/registration", Register);
app.use("/send",SendMessage)

const PORT = process.env.PORT || 5000;

// app.use("/", (req, res) => {
//   res.send("I am listening");
// });
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
