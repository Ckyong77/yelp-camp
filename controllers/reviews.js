const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReviews = async (req, res, next) => {
    const { id } = req.params;
    const {body, rating} = req.body.review;
    const campground = await Campground.findById(id);
    const review = new Review({body, rating, author: req.user});
    // console.log(review)
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteReviews = async (req, res, next) => {
    console.log('im in delete')
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}