const mongoose = require("mongoose");
const DB = process.env.DB;

// db connection
mongoose
  .connect(
    DB
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.error(err));
