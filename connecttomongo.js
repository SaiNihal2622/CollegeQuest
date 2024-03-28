
import express from "express";
import mongoose from "mongoose";

//instead of local host we need to write 0.0.0.0
const url = 'mongodb://0.0.0.0:27017/employee';

//for connecting mongodb
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.once('open', () => {
    console.log("Connected to database");
});

conn.on('error', (error) => {
    console.error('Error:', error.message);
    process.exit();
});

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// Corrected the model creation
const collection = mongoose.model('collegequest', schema);

const data = [{
    name: "Saikrishna"
}];

// Corrected the insertMany call
collection.insertMany(data)
    .then(() => {
        console.log("Data inserted successfully");
    })
    .catch((error) => {
        console.error("Error inserting data:", error.message);
    });

const app = express();
app.listen(8000, () => {
    console.log("Port is listening");
});
