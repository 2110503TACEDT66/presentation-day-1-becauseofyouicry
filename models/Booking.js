const mongoose = require('mongoose') ;
const User = require('../models/User');

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

BookingSchema.pre('save', {document : true , query : false}, async function (next) {
    const updateUser = await User.findByIdAndUpdate(this.user , {"$push" : {"bookings" : this.id}});
    console.log(updateUser);
});

module.exports=mongoose.model('Booking',BookingSchema) ;