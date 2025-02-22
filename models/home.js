const mongoose = require("mongoose");

//This is the schema for the Home collection
const homeSchema = new mongoose.Schema({
    houseName: {type: String, required:true},
    price: {type: Number, required:true},
    location: {type: String, required:true},
    rating: {type: String, required:true},
    photoURL: String,
    description: String,
    hostId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Home", homeSchema)