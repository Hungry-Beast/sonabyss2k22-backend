const express = require("express");
const app = express();
const cors = require("cors");
require("./firebaseAuth");
const mongoConnect = require("./db");
const Club = require("./routes/Club");
mongoConnect();
app.use(cors());
app.use("/clubs", Club);

const PORT = process.env.PORT || 3000;

// app.use("/", (req, res) => {
//   res.send("I am listening");
// });
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
