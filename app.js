const express = require("express");
const path = require("path");
const { mongoConnect } = require("./services/mongo");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

async function startServer() {
  await mongoConnect();

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
