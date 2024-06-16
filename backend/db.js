
"use strict";

const { MongoClient } = require('mongodb');
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Load the initial data from a local module
const data = require('./data');

// Transform flight data from object to array suitable for MongoDB
const transformData = () => {
  return Object.entries(data.flights).map(([flightCode, seats]) => {
      return {
          _id: flightCode,    // Set the _id to the flight code
          flight: flightCode, // Duplicate flight code for the 'flight' field
          seats               // Include the array of seats
      };
  });
};
// FUNCTION TO INSERT DATA INTO DATABASE
const insertData = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db('booking-SlingAir');
    console.log('Connected to MongoDB!');

    // Transforming flight data
    const transformedFlights = transformData();

    // Inserting flights
    const flightsCollection = db.collection('flights');
    const flightsResult = await flightsCollection.insertMany(transformedFlights);
    console.log(`Inserted ${flightsResult.insertedCount} flight records`);

    // Inserting reservations
    const reservationsCollection = db.collection('reservations');
    const reservationsResult = await reservationsCollection.insertMany(data.reservations);
    console.log(`Inserted ${reservationsResult.insertedCount} reservation records`);

  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await client.close();
  }
};
insertData();
// Optionally export insertData if you plan to use it from another module
module.exports = { insertData };
