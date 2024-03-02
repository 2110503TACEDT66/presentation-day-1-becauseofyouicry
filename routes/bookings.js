const express = require('express') ;
const {getBookings} = require('../controllers/booking') ;

const router = express.Router({mergeParams:true}) ;

const {protect} = require('../middleware/auth') ;

router.route('/').get(protect, getBookings) ;

module.exports = router ;