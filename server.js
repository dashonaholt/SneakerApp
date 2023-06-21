const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

//from env file
process.env.SECRET;

//Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "client", "build")));

//Routes (go here)
app.use("/auth", require("./routes/authRouter.js"));
//app.use("/api");
app.use("/api/sneakers", require("./routes/sneakersRouter.js"));
app.use("/api/comment", require("./routes/commentRouter.js"));

//connect to MongoDB
mongoose.set("strictQuery", true);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the DB");
  } catch (error) {
    console.error("Error connecting to the DB:", error);
  }
})();

app.use(express.static(path.join(__dirname, "client", "build")));

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(err.status);
  }
  return res.send({ errMsg: err.message });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
//Server Listen
app.listen(9000, () => {
  console.log("The server is running on Port 9000");
});
