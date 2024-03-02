exports.getCampgrounds = (req, res,next) => {
    res.status (200).json({success:true, msg:'Show all campgrouds'});
};
exports.getCampground = (req, res,next) => {
    res.status (200).json({success:true, msg:`Show campgroud ${req.params.id}`});

};
exports.createCampground = (req, res,next) => {
    res.status (200).json({success:true, msg:'Create new campgrouds'});
};
exports.updateCampground = (req,res,next) => {
    res.status (200).json({success:true, msg:`Update campgroud ${req.params.id}`});
};
exports.deleteCampground = (req, res,next) => {
    res.status (200).json({success:true, msg:`Delete campgroud ${req.params.id}`});
};