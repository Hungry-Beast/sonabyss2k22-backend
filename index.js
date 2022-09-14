const express = require("express");
const app = express();
const cors = require("cors");
require('./firebaseAuth')
const mongoConnect = require("./db");
const Club = require("./routes/Club");
mongoConnect();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
