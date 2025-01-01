require("dotenv").config();
const PORT = process.env.PORT || 8090;
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to the world!");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
