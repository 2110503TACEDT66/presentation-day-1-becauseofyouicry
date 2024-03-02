
const express = require('express');
const {getCampgrounds,getCampground,createCampground,updateCampground,deleteCampground} = require ('../controllers/campground')
const router = express.Router();
router.route('/').get(getCampgrounds).post(createCampground);
router.route('/:id').get(getCampground).put(updateCampground).delete(deleteCampground);

module.exports =router;