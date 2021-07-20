const express = require('express')
const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose')
const User = require('./models/users')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')

const app = express()
const port = process.env.PORT || 3000

require('dotenv').config()

const authRoutes = require('./routes/auth')

// MongoDB Connection
const uri = process.env.DB_URL
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
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

//login middleware
const isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    next()
}


app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.get('/', (req, res)=>{
    res.render('landing')
})


app.get('/home', isLoggedIn, (req, res)=>{
    res.render('home')
})


app.use('/', authRoutes)

app.listen(port, ()=>{
    console.log(`NodeJS Server Started at Port ${port}`)
})