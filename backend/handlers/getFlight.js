"use strict";
require("dotenv").config();
const { MongoClient } = require('mongodb');

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getFlight = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db('booking-SlingAir');
        console.log('Connected to MongoDB!');

        const { flight } = req.params;
      
        const flightNumbers = await db.collection('flights').findOne({flight});
        res.status(200).json({ status: 200, data: flightNumbers.seats });

    } catch (err) {
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

module.exports = getFlight;
