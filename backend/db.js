"use strict";
const { flights, reservations } = require('./data');

require("dotenv").config();
const { MongoClient } = require('mongodb');

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// FUNCTION TO INSERT DATA INTO DATABASE

const insertData = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db('slingAir');
    console.log('Connected to MongoDB!');


    // Inserting flights
    const flightsCollection = db.collection('flights');
    await flightsCollection.insertMany(flights);

    // Inserting reservations
    const reservationsCollection = db.collection('reservations');
    await reservationsCollection.insertMany(reservations);

  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await client.close();
  }
};

