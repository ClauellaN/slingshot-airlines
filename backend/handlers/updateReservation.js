"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Async function to update reservation details and seat availability
const updateReservation = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { reservationId, newSeat } = req.body;

    if (!reservationId || !newSeat) {
        return res.status(400).json({
            status: 400,
            message: "Required data missing: reservationId or newSeat not provided"
        });
    }

    try {
        await client.connect();
        const db = client.db("booking-SlingAir");
        console.log("Connected!");

        // Fetch the current reservation to get old seat and flight ID
        const reservation = await db.collection("reservations").findOne({_id: reservationId});
        console.log(reservation);
        if (!reservation) {
            return res.status(404).json({ status: 404, message: "Reservation not found" });
        }

        const oldSeat = reservation.seat;
        const flightId = reservation.flight;

        // Make the old seat available
        await db.collection("flights").updateOne(
            { _id: flightId, "seats.id": oldSeat },
            { $set: { "seats.$.isAvailable": true } }
        );

        // Update the reservation with the new seat
        const updateResult = await db.collection("reservations").updateOne(
            { _id: reservationId },
            { $set: { seat: newSeat } }
        );
        // Reserve the new seat
        await db.collection("flights").updateOne(
            { _id: flightId, "seats.id": newSeat },
            { $set: { "seats.$.isAvailable": false } }
        );

        res.status(200).json({
            status: 200,
            message: "Reservation updated successfully!",
            data: updateResult
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    } finally {
        await client.close();
        console.log("Disconnected!");
    }
};

module.exports = updateReservation;
