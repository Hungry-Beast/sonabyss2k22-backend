const express = require("express");
const app = express();
const cors = require("cors");
require("./firebaseAuth");
const mongoConnect = require("./db");
const Club = require("./routes/Club");
const Event = require("./routes/Event");
const Register = require("./routes/Register");
const SendMessage = require("./routes/SendMessage");
const Auth = require("./routes/auth");
const Organisers = require("./routes/Organisers");
var path = require("path");
var public = path.join(__dirname, "");
// require('./routes/Test')
var bodyParser = require("body-parser");
mongoConnect();

app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json());
app.use(cors());
app.use("/clubs", Club);
app.use("/events", Event);
app.use("/registration", Register);
app.use("/send", SendMessage);
app.use("/auth", Auth);
app.use("/orgainsers", Organisers);

const PORT = process.env.PORT || 5000;

// app.use("/", (req, res) => {
//   res.send("I am listening");
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
