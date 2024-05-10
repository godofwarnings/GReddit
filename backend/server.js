require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const userRoutes = require("./routes/api/user");
const postRoutes = require("./routes/api/post");
const subredditRoutes = require("./routes/api/subreddit");
const reportRoutes = require("./routes/api/report");
// express app
const app = express();
app.use(express.json()); // to enable us to handle json objects
// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); // to remove the deprecation warning

// Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/subreddit", subredditRoutes);
app.use("/report", reportRoutes);

mongoose.set("strictQuery", false); // to remove deprecation warning
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB. Listening on port ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// username: gow17
// password: lEphfiOMral8DzMm
