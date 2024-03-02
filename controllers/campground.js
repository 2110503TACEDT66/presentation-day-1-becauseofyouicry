const Campground = require('../models/Campground.js')

exports.getCampgrounds = async(req, res,next) => {
    try{
        const campgrouds = await Campground.find();
        res.status (200).json({success:true, count:campgrouds.length,data: campgrouds});
    } catch (err) {
        res.status(400).json({success:false});
    }
};
exports.getCampground = async(req, res,next) => {
    try{
        const campgroud = await Campground.findById(req.params.id);
        if(!campgroud){
            return res.status(400).json({success : false});
        }
        res.status (200).json({success:true, data: campgroud});
    } catch(err) {
        res.status(400).json({success:false});
    }

};
exports.createCampground = async(req, res,next) => {
    const campgroud = await Campground.create(req.body);
    res.status (201).json({
        success:true, 
        data : campgroud
    });
};

exports.updateCampground= async (req, res,next)=>{
    try{
        const campground = await Campground.findByIdAndUpdate (req.params.id, req.body, { 
            new: true,
            runValidators:true
        });
        if(!campground) {
            return res.status (400).json({success:false});
        };
        res.status (200).json({success:true, data: campground});
    } catch (err) {
        res.status (400).json({success:false});
    }
};
exports.deleteCampground = async(req, res,next) => {
    try{
        const campground = await Campground.findByIdAndDelete (req.params.id);
        if(!campground) {
            return res.status (400).json({success:false});
        };
        res.status (200).json({success:true, data: {}});
    } catch (err) {
        res.status (400).json({success:false});
    }
};