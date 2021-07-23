const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const {cloudinary} = require('../cloudinary')
const Product = require('../models/products')
const {isLoggedIn} = require('../middleware')
const app = express.Router()

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({storage})

const {landing, home, allProducts, newProduct, createProduct, showProduct, editProduct, updateProduct, deleteProduct} = require('../controllers')

app.get('/', landing)
app.get('/home', isLoggedIn, home)

app.get('/products', isLoggedIn, allProducts)
app.get('/products/new', isLoggedIn, newProduct)
app.post('/products', isLoggedIn, upload.single('image'), createProduct)
app.get('/products/:id', isLoggedIn, showProduct)
app.get('/products/:id/edit', isLoggedIn, editProduct)
app.put('/products/:id', isLoggedIn, upload.single('image'), updateProduct)
app.delete('/products/:id', isLoggedIn, deleteProduct)

module.exports = app