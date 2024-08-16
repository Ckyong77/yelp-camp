const express = require('express')
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {isLoggedIn, isReviewAuthorized, validateReview} = require('../middleware.js')

//import review controller
const reviews = require('../controllers/reviews.js')

router.post('/', isLoggedIn,validateReview, catchAsync(reviews.createReviews))

router.delete('/:reviewId', isLoggedIn, isReviewAuthorized, catchAsync(reviews.deleteReviews))

module.exports = router;