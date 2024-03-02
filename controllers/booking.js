const Booking = require('../models/Booking') ;
const Campground = require('../models/Campground') ;

exports.getBookings = async (req,res,next)=>{
    let query ;
    if(req.user.role !== 'admin'){ //User
        query = Booking.find({user:req.user.id}).populate({
            path:'campground',
            select:'name address telephone_number'
        }) ;
    }else{ //admin
        if(req.params.campgroundId){
            console.log(req.params.campgroundId);
            query = Booking.find({campground: req.params.campgroundId}).populate({
                path:'campground',
                select:'name address telephone_number'
            }) ;
        }else
        query = Booking.find().populate({
            path:'campground',
            select:'name address telephone_number'
        }) ;
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

exports.getBooking=async (req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path: 'campground',
            select: 'name description telephone_number'
        });
        if(!Campground){
            return res.status(404).json({success:false,message:`No Booking with the id of ${req.params.id}`}) ;
        }
            return res.status(200).json({success:true,data: booking}) ;
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:`Cannot find Booking`}) ;
    }
}

exports.addBooking=async (req,res,next)=>{
    try{
        req.body.campground = req.params.campgroundId ;
        const campground = await Campground.findById(req.params.campgroundId) ;
        
        if(!campground){
            return res.status(404).json({success:false,message:`No campground with the id of ${req.params.id}`}) ;
        }
        
        //add user id to req body
        req.body.user=req.user.id;
        //check for existed booking
        const existedBookings = await Booking.find({user:req.user.id});
        //If the user is not an admin, they can only create 3 booking
        if(existedBookings.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 Booking`});
        }

        const booking = await Booking.create(req.body) ;
        res.status(200).json({success:true,data: booking}) ;
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:`Cannot created Booking`}) ;
    }
}

exports.updateBooking=async (req,res,next)=>{
    try{
        let booking = await Booking.findById(req.params.id) ;
        
        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`}) ;
        }
        
        //Make sure user is the booking owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message: `User ${req.user.id} is not authorized to update this booking`});
        }

        booking = await Booking.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true}) ;
        res.status(200).json({success:true,data: booking}) ;
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:`Cannot update Booking`}) ;
    }
}

exports.deleteBooking=async (req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id) ;
        
        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`}) ;
        }
        await booking.deleteOne() ;
        res.status(200).json({success:true,data: {}}) ;
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:`Cannot delete Booking`}) ;
    }
}