const mongoose = require("mongoose");
const {Schema} = mongoose;

const itemSchema = new Schema({
    title: String, 
    description: String, 
    completed: { type: Boolean, default: false},
    userId: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Item", itemSchema);