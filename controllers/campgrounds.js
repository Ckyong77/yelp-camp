const Campground = require('../models/campground')

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const { title, location, description, image, price } = req.body.campground;
    const newCamp = new Campground({ title, location, description, image, price, author: req.user._id });
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp.id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    const user = req.user;
    res.render('campgrounds/details', { campgrounds, user })
}

module.exports.editForm = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    res.render('campgrounds/edit', { campgrounds })
}


module.exports.updateEditCampground = async (req, res, next) => {
    const { id } = req.params;
    const { title, location, description, image, price } = req.body.campground;
    const campgrounds = await Campground.findByIdAndUpdate(id, { title, location, description, image, price }, { runValidators: true, new: true })
    res.redirect(`/campgrounds/${campgrounds.id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}