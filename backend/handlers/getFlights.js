"use strict";
require("dotenv").config();
const { MongoClient } = require('mongodb');

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// returns an array of all flight numbers
const getFlights = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db('booking-SlingAir');
        console.log('Connected to MongoDB!');

        // retrieving all flight numbers using distinct method
        const flightNumbers = await db.collection('flights').distinct('flight');
        
        res.status(200).json({ status: 200, data: flightNumbers, message: 'All flights successfully retrieved!' });
    } catch (err) {
        res.status(500).json({ status: 500, message: 'Server Error!' });
    } finally {
        await client.close();
    }
};

module.exports = getFlights;
