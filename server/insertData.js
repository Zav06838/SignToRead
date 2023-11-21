const mongoose = require("mongoose");
const Gloss = require("./models/glossModel");
require("dotenv").config();

// Connect to MongoDB Atlas
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

// Dummy data
const dummyData = [
  {
    englishText: "The sun rises in the east every morning",
    pslGloss: "daily sun east rises",
  },
  {
    englishText: "She read books in her free time",
    pslGloss: "she free read book",
  },
  {
    englishText: "I am studying for my exams right now",
    pslGloss: "examination I study now",
  },
  {
    englishText: "She is cooking dinner in the kitchen",
    pslGloss: "She dinner cook in kitchen",
  },
];

// Insert dummy data into the database
Gloss.insertMany(dummyData)
  .then(() => {
    console.log("Dummy data inserted successfully");
  })
  .catch((error) => {
    console.error("Error inserting dummy data:", error);
  })
  .finally(() => {
    // Disconnect from the database after insertion
    mongoose.disconnect();
  });
