const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const database = require('./db/db')
const port = process.env.PORT
const cors = require('cors'); 

// database connections
database();

// middleware
app.use(cors());
app.use(express.json());

app.use(express.static('build'));

 
// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})