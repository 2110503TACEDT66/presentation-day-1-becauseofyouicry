const mongoose = require('mongoose') ;

const BookingSchema = new mongoose.Schema({
    campground : {
        type : mongoose.Schema.ObjectId,
        ref : 'Campground',
        require : true 
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        require : true 
    },
    Date : {
        type : Date,
        require : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports=mongoose.model('Booking',BookingSchema) ;