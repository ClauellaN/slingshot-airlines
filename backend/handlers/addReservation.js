"use strict";
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Creates a new reservation
const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  console.log('Connecting to database...');
  const newReservation = {
    _id: uuidv4(), // Generate a unique ID for the reservation
    ...req.body
  };
  const flightId = req.body.flight;
  const seatId = req.body.seat;

  try {
    await client.connect();
    const db = client.db('booking-SlingAir');
    console.log('Connected to MongoDB!');
    console.log('Inserting new reservation:', newReservation);

    const result = await db.collection('reservations').insertOne(newReservation);

    // Update the flights collection to set the seat as unavailable
    const updateResult = await db.collection('flights').updateOne(
      { flight: flightId, "seats.id": seatId },
      { $set: { "seats.$.isAvailable": false } }
    );
    res.status(201).json({
      status: 201,
      data: newReservation._id,
      message: 'Reservation added successfully!'
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error: ' + err.message });
  } finally {
    await client.close();
  }
};

module.exports = addReservation;
