const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../joiSchema.js')
const { isLoggedIn, validateCampground, isAuthorized } = require('../middleware')

//requring the controllers
const campgrounds = require('../controllers/campgrounds.js')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .patch(isAuthorized, isLoggedIn, validateCampground, catchAsync(campgrounds.updateEditCampground))
    .delete(isAuthorized, isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isAuthorized, isLoggedIn, catchAsync(campgrounds.editForm))

module.exports = router;