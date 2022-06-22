const path = require("path")
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

const app = express()

mongoose.connect("mongodb+srv://mannawar:" + process.env.MONGO_ATLAS_PW + "@testcluster.e7vhu.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected to db!")
})
.catch(() => {
    console.log('Coonection failed!')

})

// body parser to extract data from the body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/images", express.static(path.join("backend/images")))

// cors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS")
    next()
})

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);


module.exports = app;