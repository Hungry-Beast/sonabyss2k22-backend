const express = require("express");
const app = express();
const cors = require("cors");
const mongoConnect = require("./db");
mongoConnect();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
