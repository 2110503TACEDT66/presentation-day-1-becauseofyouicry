const Campground = require('../models/Campground.js')
const axios = require('axios');
exports.getCampgrounds = async(req, res,next) => {
    let query;
    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = Campground.find(JSON.parse(queryStr)).populate('bookings')
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    } else {
        query=query.sort('name');
        
    }
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    try{
        const total = await Campground.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const campgrounds = await query;
        const pagination = {};
        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }
        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true,count:campgrounds.length,pagination,data:campgrounds});
    } catch (err) {
        res.status(400).json({success:false});
    }
};
exports.getCampground = async(req, res,next) => {
    try{
        const campground = await Campground.findById(req.params.id);
        if(!campground){
            return res.status(400).json({success : false});
        }
        res.status (200).json({success:true, data: campground});
    } catch(err) {
        res.status(400).json({success:false});
    }

};
exports.createCampground = async(req, res,next) => {
    const campground = await Campground.create(req.body);
    res.status (201).json({
        success:true, 
        data : campground
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
        const campground = await Campground.findById (req.params.id);
        if(!campground) {
            return res.status (400).json({success:false});
        };
        await campground.deleteOne();
        res.status (200).json({success:true, data: {}});
    } catch (err) {
        res.status (400).json({success:false});
    }
};

function extractTownFromAddress(address) {
    const words = address.split(' ');

    if (words.length >= 2) {
        const town = words[words.length - 2];
        return town;
    } else {
        return null;
    }
}



async function getWeatherByTown(town) {
    try {
        const apiKey = '5d7444efbcf9d4d1647096d8f748c38e';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${town}&units=metric&APPID=${apiKey}`;

        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching weather data');
    }
}
exports.getCampgroundWeather = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id);

        if (!campground) {
            return res.status(400).json({ success: false, message: 'Campground not found' });
        }

        const town = extractTownFromAddress(campground.address);
        if (!town) {
            return res.status(400).json({ success: false, message: 'Town not found in the address' });
        }

        const weatherData = await getWeatherByTown(town);
        return res.status(200).json({ success: true, data: weatherData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error getting weather data' });
    }
};

const generateGoogleMapsUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps?q=${encodedAddress}`;
  };
  
exports.getCampgroundLocation = async (req, res, next) => {
    try {
      const campground = await Campground.findOne({
        _id: req.params.id,
      }).select('address');
  
      if (!campground) {
        return res.status(404).json({
          success: false,
          message: `No campground found with the id of ${req.params.id}`,
        });
      }
  
      const address = campground.address;
      const googleMapsUrl = generateGoogleMapsUrl(address);
  
      res.status(200).json({
        success: true,
        address: address,
        googleMapsUrl: googleMapsUrl,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).json({
        success: false,
        message: 'Cannot retrieve campground location',
      });
    }
  };
  


