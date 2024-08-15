if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const ExpressError = require('./utils/ExpressError')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo')


//models
const User = require('./models/user')

//Routes
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users');

const app = express();

app.engine('ejs', ejsMate);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//MongoDB
// 
// mongodb://localhost:27017/yelp-camp
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

async function main() {
    await mongoose.connect(dbUrl)
}

main()
    .then(() => {
        console.log('database is conncted!')
    })
    .catch((err) => {
        console.log('Failed Connection')
        console.log(err)
    })

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: 'thisistemporarySecret'
    },
    touchAfter: 24 * 3600
})

//session initialize
const sessionConfig = {
    store: store,
    name: 'trialSession',
    secret: 'thisistemporarySecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 604800000,
        maxAge: 604800000
    }
}

app.use(session(sessionConfig))

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Routes middleware
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/', userRoutes)

// app.use((req, res, next) => {
//     res.locals.currUser = req.user;
//     next();
// })

app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('page not found!!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('Serving on port 3000`')
})

