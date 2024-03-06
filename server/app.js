const express = require("express");
const mongoose = require("mongoose");
const glossRouter = require("./routes/glossRoutes");
const modelRouter = require("./routes/model");
// const userRouter = require("./routes/userRoutes");
const cors = require("cors"); // Import the cors middleware

const userRoutes = require("./routes/user");

const videoRouter = require("./routes/videoRoutes");

const videoBackup = require("./routes/videoBackup");

const videoModel = require("./routes/videoModel");

const finalRouter = require("./routes/final");

require("dotenv").config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://119.63.132.178:5000",
  ], // Allow requests from both frontend origins
  credentials: true, // To allow cookies
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to set CORS headers
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Update to match the domain of your app
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db and listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Use the gloss router
// app.use("/api/glosses", glossRouter);

// Use the user router
// app.use("/api/users", userRouter); // Mount the user routes at "/api/users"
app.use("/api/users", userRoutes);

// app.use(modelRouter);
// app.use(videoRouter);
app.use(finalRouter);
// app.use(videoModel);
// app.use(videoBackup);

// ... any additional routes or middleware

module.exports = app;
