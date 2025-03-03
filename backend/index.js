const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json())


var db;
const uri = "mongodb://127.0.0.1:27017/";

MongoClient.connect(uri).then((client)=>{
    db = client.db('progig');
    console.log("Database Connected");
}
).catch((err)=>{console.log("MongoDB Connection Error")});

app.post("/loginUser", async(req, res) => {
    const {email, password } = req.body;

    const user = await db.collection('users').findOne({email});
    if(!user){
        return res.status(401).json({message: "User not found"});
    }
    else{
        return res.status(401).json({message: "User found"});
    }
});


app.listen(5000, ()=>{
    console.log("Server running on Port 5000")
})
