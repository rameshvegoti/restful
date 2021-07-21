const express = require('express')
const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose')
const User = require('./models/users')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const {isLoggedIn} = require('./middleware')

const app = express()
const port = process.env.PORT || 3000

require('dotenv').config()

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')

// MongoDB Connection
const uri = process.env.DB_URL
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
    useFindAndModify: false
};

mongoose.connect(uri, options)
.then(()=> console.log('MongoDB Connected Successfully...'))
.catch(err => console.log(err))
// Completion of MongoDB Connection


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(session({
    secret : 'thisshouldbebettersecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 4 * 7,
        maxAge : 1000 * 60 * 60 * 4 * 7
    }
}))
app.use(flash())

// Passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})



app.use('/', authRoutes)
app.use('/', productRoutes)


//404 found
app.all('*', (req, res, next) =>{
    next (new Error('Page Not Found!!!', 404))
})

// Error Handler
app.use((err, req, res, next) =>{
    const { statusCode = 500} = err;
    if (err.name === 'CastError') {
        err.message = 'Page not found'
    } 
    if (err.name === 'ValidationError'){
        err.message = 'Validation Error in Form Data'
    } 
    res.status(statusCode).render('error', {err})
})

app.listen(port, ()=>{
    console.log(`NodeJS Server Started at Port ${port}`)
})