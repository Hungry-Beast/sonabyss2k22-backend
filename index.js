const express = require("express");
const app = express();
const cors = require("cors");
require("./firebaseAuth");
const mongoConnect = require("./db");
const Club = require("./routes/Club");
const Event = require("./routes/Event");
const Register = require("./routes/Register");
const Auth = require("./routes/auth");
const Organisers = require("./routes/Organisers");
var path = require("path");
// var public = path.join(__dirname, "");
const session = require('express-session')
require('./routes/Test')
var bodyParser = require("body-parser");
mongoConnect();
const ejsMate=require('ejs-mate')

app.engine('ejs',ejsMate);
app.set('view engine','ejs')

// path
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);




app.use(express.json());
app.use(cors());
app.use("/clubs", Club);
app.use("/events", Event);
app.use("/registration", Register);
app.use("/auth", Auth);
app.use("/organisers", Organisers);


const PORT = process.env.PORT || 5000;

const Clubs=require('./models/Club');

// app.get("/", async(req, res) => {
//   // const clubs = await Clubs.find();
//   // console.log(clubs)
//   res.render('index')
// });

app.get('/',(req,res)=>{
  res.send("we will be live soon")
})

app.get('/test',(req,res)=>{
  res.render('test')
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
