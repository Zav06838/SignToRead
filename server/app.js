const express = require("express");
const mongoose = require("mongoose");

// const userRouter = require("./routes/userRoutes");
const cors = require("cors"); // Import the cors middleware

const userRoutes = require("./routes/user");

const videoRouter = require("./routes/videoRoutes");

const localRouter = require("./routes/videoLocal");

require("dotenv").config();

const app = express();
app.use(express.json());

// Middleware to set CORS headers
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://119.63.132.178:5000",
    "https://sign-to-read.vercel.app/",
  ], // Allow requests from both frontend origins
  credentials: true, // To allow cookies
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

app.use("/api/users", userRoutes);

// app.use(videoRouter);
app.use(localRouter);

module.exports = app;
