"use strict";
require("dotenv").config();
const { MongoClient } = require('mongodb');

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// returns all reservations
const getReservations = async(req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try{
        await client.connect();
        const db = client.db('booking-SlingAir');

        const allReservations = await db.collection('reservations').find().toArray();
        
        res.status(200).json({status:200 , data:allReservations , message: 'All reservations successfully retrieved!'})
    }
    catch(err){
        res.status(500).json({status:500 , message:'server error: ' + err.message})
    }
    finally{
        await client.close();
    }
};

module.exports = getReservations;
