require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const UserRoutes = require("./routes/user.routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", UserRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  if (err.params) {
    return res.status(status).json({
      error: message,
      params: err.params,
    });
  } else {
    return res.status(status).json({
      error: message,
    });
  }
});

app.listen(process.env.PORT, (req, res) => {
  console.log("Server is listening on port ", process.env.PORT);
});

mongoose
  .connect("mongodb://localhost:27017/taskDB")
  .then((res) => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log("Something went wrong in connecting database connection");
  });
