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
}, {
    toJSON : {virtuals:true},
    toObject:{virtuals:true}
});
CampgroundSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log('Bookings being removed from campground ${this_id}');
    await this.model('Booking').deleteMany({campground:this._id});
    next();
});
CampgroundSchema.virtual('bookings',{
    ref:'Booking',
    localField:'_id',
    foreignField:'campground',
    justOne:false
});
module.exports = mongoose.model('Campground',CampgroundSchema);