const mongoose = require("mongoose");
const {Schema} = mongoose;

const itemSchema = new Schema({
    title: String, 
    description: String, 
    completed: { type: Boolean, default: false}});

module.exports = mongoose.model("Item", itemSchema);