const { campgroundSchema } = require('./joiSchema')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const {reviewSchema} = require('./joiSchema.js')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body)
    console.log(result.error)
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthorized = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        //can flash some messages here to give warning that cannot do this. 
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthorized = async (req, res, next) => {
    const { reviewId,id } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        //can flash some messages here to give warning that cannot do this. 
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}