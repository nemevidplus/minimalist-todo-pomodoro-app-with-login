const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const itemRoute = require("./routes/items");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

dotenv.config();

const app = express();
const port = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//mongoose connect
mongoose.connect(process.env.MONGO_URL).then(() =>{
    console.log("DB9 is connected")
})

app.use("/api/items", itemRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(port, function() {
    console.log("Evi is da house 9 times with css which goes to github etc")
})