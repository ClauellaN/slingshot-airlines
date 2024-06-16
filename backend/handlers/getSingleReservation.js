
"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

// Returns a single reservation
const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI); // No options object

  const {reservation} = req.params;
 const resID = {_id:reservation}

  try {
    await client.connect();
    const db = client.db('booking-SlingAir');
    const collection = db.collection('reservations');

const singleReservation = await collection.findOne(resID);

    if (singleReservation) {
      res.status(200).json({ status: 200, data: singleReservation });
    } else {
      res.status(404).json({ status: 404, message: 'Reservation not found' });
    }
  } 
  catch (err) {
    console.error('Error retrieving reservations:', err);
    res.status(500).json({ error: 'Error occurred while retrieving data' });
  } 
  
  finally {
    await client.close(); // Ensure the client is properly closed
  }
};

module.exports = getSingleReservation;
