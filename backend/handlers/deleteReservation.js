"use strict";
require("dotenv").config();
const { MongoClient } = require('mongodb');

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Deletes a single reservation by ID
const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { reservation } = req.params;

  const flightId = req.body.flight;
  const seatId = req.body.seat;
  
  try {
    await client.connect();
    const db = client.db('booking-SlingAir');
    console.log('Connected to MongoDB!');
    
    const result = await db.collection('reservations').deleteOne({ _id: reservation });
    if (result.deletedCount === 1) {
      // UPDATE the flights collection and set the seat to available
      const updateResult = await db.collection('flights').updateOne(
        { flight: flightId, "seats.id": seatId },
        { $set: { "seats.$.isAvailable": true } }
      );
      res.status(200).json({
        status: 200,
        message: 'Reservation deleted successfully and seat is available!'
      });
    } else {
      res.status(404).json({ status: 404, message: 'Reservation not found' });
    }
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

module.exports = deleteReservation;
