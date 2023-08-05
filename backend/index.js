const express = require("express");
const cors = require('cors');
require('dotenv').config();
const mongoose = require("mongoose");
const dataSyncer = require("./controllers/contest/DataSyncController");
const contestSyncer = require("./controllers/contest/contestController");
const contestRouter = require("./routes/contest/contestRoutes");

//* Check for ENV file
console.log(process.env.TEST);

//* Function to start server with MongoDB and UpcomingContest list.
async function startServer() {
    try {
        const app = express();

        app.use(cors());

        //* Connects MongoDB
        await mongoose.connect(process.env.MONGODB_URL)
            .then(() => console.log("MongoDB Connected."))
            .catch((err) => console.log("Error:", err));

        //* Fetches data from APIs to MongoDB
        await dataSyncer.syncContests();
        setInterval(dataSyncer.syncContests, 60 * 60 * 1000);

        //* Adds data from MongoDB to contestlist variable
        await contestSyncer.updateContests();
        setInterval(contestSyncer.updateContests, 60 * 60 * 1000);

        //* GET route for contests
        app.use("/api/contests", contestRouter);

        //* PORT for server
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });

    }
    catch (err) {
        console.log("Error starting server:", err);
    }
}

startServer();