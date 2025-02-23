const { MongoClient } = require('mongodb');

// MongoDB URI and client setup
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);


client.connect();

const db = client.db('progig');
const collection = db.collection('users');

const result = db.collection('users').insertOne({
    username : "Manoj",
    email : "manoj@gmail.com",
    password : "Manoj@1234"
});