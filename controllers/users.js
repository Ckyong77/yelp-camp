const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            res.redirect('/campgrounds')
        })

    } catch (e) {
        //print some error message about the error message in React
        //also can pass the error mesasge to React. 
        console.log(e.message)
        res.redirect('/register')
    }
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    res.redirect('/campgrounds')
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/campgrounds')
    });

}