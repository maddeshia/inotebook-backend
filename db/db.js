const mongoose = require("mongoose");

const dotenv = require('dotenv');
dotenv.config()

const connectDB = async () => {
        
    mongoose
    .connect(process.env.DATABASE_URL)
    .then(()=> console.log("Connection Successful...."))
    .catch((err)=>console.log("err"));

}

module.exports = connectDB;