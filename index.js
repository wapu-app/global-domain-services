const express = require("express");
const routes = require("./routes/routes");
require('dotenv').config()
const path = require("path");
const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/", routes);
app.use(express.static(path.join(__dirname, "/public")));

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});

module.exports = app;
