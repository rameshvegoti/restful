const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/users')
const app = express.Router()


//Registration
app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', async (req, res)=>{
        const newUser = await User.register({username: req.body.username, email: req.body.email}, req.body.password)
        .then(()=>{
            req.flash('success', req.body.username.toUpperCase() + '!!! registration successful...pls login')
            return res.redirect('/login')
        })
        .catch((err)=>{
            req.flash('error', err.message)
            return res.redirect('/register')
        })
})

// Login

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res)=>{
    req.flash('success', 'You have successfully loggedin...')
    res.redirect('/home')
})

app.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success', ' You have successfully logged Out...')
    res.redirect('/login')
})


module.exports = app