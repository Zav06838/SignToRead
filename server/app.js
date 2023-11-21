const express = require("express");
const mongoose = require("mongoose");
const glossRouter = require("./routes/glossRoutes");
const cors = require("cors"); // Import the cors middleware

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

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

app.use("/api/glosses", glossRouter);

