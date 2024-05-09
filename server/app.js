const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const videoRouter = require("./routes/videoRoutes");
const awsRouter = require("./routes/best_working_code");
const localRouter = require("./routes/videoLocal");
const historyRoutes = require("./routes/historyRoutes");

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
    "https://119.63.132.178:5000",
    "https://sign-to-read.vercel.app",
    "https://119.63.132.178:5001",
    "http://localhost:5000",
    "https://0a83-205-164-158-83.ngrok-free.app",
    "*",
  ], // Allow requests from both frontend origins
  credentials: true, // To allow cookies
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// const clerk = new Clerk({
//   apiKey: process.env.CLERK_PUBLIC_KEY,
// });

// app.use((req, res, next) => {
//   const sessionId = req.header("X-Clerk-Session-Id");
//   if (sessionId) {
//     clerk.users
//       .getUserFromSessionId(sessionId)
//       .then((user) => {
//         req.user = user;
//         next();
//       })
//       .catch((error) => {
//         console.error("Error fetching user:", error);
//         next();
//       });
//   } else {
//     next();
//   }
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

app.get("/", (req, res) => {
  res.send("Backend is properly hosted!");
});

// app.use(videoRouter);
app.use(awsRouter);
app.use(localRouter);
app.use(historyRoutes);

module.exports = app;
