const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name: {
        type : String,
        require: [true,'Please add a name'],
        unique : true,
        trim : true
    },
    address : {
        type : String,
        require: [true,'Please add a address'],
        unique : true
    },
    telephone_number : {
        type : String,
        require: [true,'Please add a telephone-number'],
        unique : true
    }
});

module.exports = mongoose.model('Campground',CampgroundSchema);