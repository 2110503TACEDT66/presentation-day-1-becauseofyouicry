const Booking = require('../models/Booking') ;

exports.getBookings = async (req,res,next)=>{
    let query ;
    if(req.user.role !== 'admin'){ //User
        query = Booking.find({user:req.user.id}) ;
    }else{ //admin
        query = Booking.find() ;
    }
    try{
        const bookings = await query ;

        res.status(200).json({
            success:true,
            count:bookings.length,
            data: bookings
        });
    } catch (error){
        console.log(error) ;
        return res.status(500).json({success:false,message:"Cannot find Booking"}) ;
    }
};