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


app.get('/', (req, res)=>{
    res.render('landing')
})

app.get('/home', isLoggedIn, (req, res)=>{
    res.render('home')
})

app.get('/products', isLoggedIn, async (req, res, next)=>{
    try {
        const products =  await Product.find({})
        res.render('products/allproducts', {products})
    } catch(err) {
        next(err)
    }
})

app.get('/products/new', isLoggedIn, (req, res)=>{
    res.render('products/newproduct')
})

app.post('/products', isLoggedIn, upload.single('image'), async (req, res, next)=>{
    try {
        const {productname, price, description} = req.body
        const {path, filename} = req.file
        
        const product = await new Product (req.body)
        product.imageUrl = req.file.path
        product.imageId = req.file.filename
        await product.save()
        
        req.flash('success', ' New product is inserted successfully....')
        res.redirect('/products')
    } catch(err){
        next(err)
    }
})

app.get('/products/:id', isLoggedIn, async (req, res, next)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            req.flash('error', ' Product not found!!!')
            return res.redirect('/products')
        }
        res.render('products/showproduct', {product})
    } catch(err){
        next(err)
    }
})

app.get('/products/:id/edit', isLoggedIn, async (req, res)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            req.flash('error', ' Product not found!!!')
            return res.redirect('/products')
        }
        res.render('products/editproduct', {product})
    } catch(err) {
        next(err)
    }
})

app.put('/products/:id', isLoggedIn, upload.single('image'), async (req, res)=>{

    try {
        const product = await Product.findById(req.params.id)
        await cloudinary.uploader.destroy(product.imageId)

        const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body)
        newProduct.imageUrl = req.file.path;
        newProduct.imageId = req.file.filename;
        await newProduct.save()
        
        req.flash('success', ' You have successfully updated product details!!!')
        res.redirect('/products')
    } catch(err){
        next(err)
    }
})

app.delete('/products/:id', isLoggedIn, async (req, res)=>{
    try {
        const product = await Product.findByIdAndRemove(req.params.id)
        if(!product){
            req.flash('error', ' Product not found!!!')
            return res.redirect('/products')
        }
        req.flash('success', 'Deleted product details...')
        res.redirect('/products')
    } catch(err) {
        next(err)
    }
})

module.exports = app