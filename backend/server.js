// "use strict";

// // import the needed node_modules.
// const express = require("express");
// const morgan = require("morgan");

// const {
//     getFlights,
//     getFlight,
//     getReservations,
//     addReservation,
//     getSingleReservation,
//     deleteReservation,
//     updateReservation,
// } = require("./handlers");

// express()
//     // Below are methods that are included in express(). We chain them for convenience.
//     // --------------------------------------------------------------------------------

//     // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
//     .use(morgan("tiny"))
//     .use(express.json())

//     // Any requests for static files will go into the public folder
//     .use(express.static("public"))
    

//     // Nothing to modify above or below this line
//     // ---------------------------------
    
//     .get("/api/get-flights", getFlights)
//     .get("/api/get-flight/:flight", getFlight)
//     .get("/api/get-reservations", getReservations)
//     .get("/api/get-reservation/:reservation", getSingleReservation)
//     .post("/api/add-reservation", addReservation)
//     .patch("/api/update-reservation", updateReservation)
//     .delete("/api/delete-reservation/:reservation", deleteReservation)

//     // ---------------------------------
//     // Nothing to modify above or below this line

//     // this is our catch all endpoint.
//     .get("*", (req, res) => {
//         res.status(404).json({
//         status: 404,
//         message: "This is obviously not what you are looking for.",
//         });
//     })

//     // Node spins up our server and sets it to listen on port 8000.
//     .listen(8000, () => console.log(`Listening on port 8000`));
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const {
    getFlights,
    getFlight,
    getReservations,
    addReservation,
    getSingleReservation,
    deleteReservation,
    updateReservation,
} = require("./handlers");

const app = express();

app
    .use(morgan("tiny"))
    .use(express.json())
    .use(express.static("public")) // Serve static files from the "public" folder
    .use(express.static(path.join(__dirname, "build"))); // Serve React build files

// API routes
app.get("/api/get-flights", getFlights);
app.get("/api/get-flight/:flight", getFlight);
app.get("/api/get-reservations", getReservations);
app.get("/api/get-reservation/:reservation", getSingleReservation);
app.post("/api/add-reservation", addReservation);
app.patch("/api/update-reservation", updateReservation);
app.delete("/api/delete-reservation/:reservation", deleteReservation);

// Catch-all handler for React (serve index.html)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
