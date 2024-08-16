const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const User = require('../models/user')

//require user controller
const users = require ('../controllers/users')

router.route('/register')
      .get(users.renderRegisterForm)
      .post(catchAsync(users.registerUser))

router.route('/login')
      .get(users.renderLogin)
      .post(passport.authenticate('local', { failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router