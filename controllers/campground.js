const Campground = require('../models/Campground.js')

exports.getCampgrounds = async(req, res,next) => {
    try{
        const campgrouds = await Campground.find();
        res.status (200).json({success:true, count:campgrouds.length,data: campgrouds});
    } catch (err) {
        res.status(400).json({success:false});
    }
};
exports.getCampground = (req, res,next) => {
    res.status (200).json({success:true, msg:`Show campgroud ${req.params.id}`});

};
exports.createCampground = async(req, res,next) => {
    const campgroud = await Campground.create(req.body);
    res.status (201).json({
        success:true, 
        data : campgroud
    });
};
exports.updateCampground = (req,res,next) => {
    res.status (200).json({success:true, msg:`Update campgroud ${req.params.id}`});
};
exports.deleteCampground = (req, res,next) => {
    res.status (200).json({success:true, msg:`Delete campgroud ${req.params.id}`});
};