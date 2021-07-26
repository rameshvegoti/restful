const Product = require('../models/products')
const { cloudinary } = require('../cloudinary')

module.exports.landing = (req, res)=>{
    res.render('landing')
}

module.exports.home = (req, res)=>{
    res.render('home')
}

module.exports.allProducts = async (req, res, next)=>{
    try {
        const products =  await Product.find({})
        if(products.length === 0){
            req.flash('error', ' No product is available in the database')
            return res.redirect('/home')
        }
        res.render('products/allproducts', {products})
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/home')
    }
}

module.exports.newProduct = (req, res)=>{
    res.render('products/newproduct')
}

module.exports.createProduct = async (req, res, next)=>{
    try {
        if(req.body.productname === '' || req.body.price === '' || req.body.description === ''){
            req.flash('error', ' Fields can not be empty')
            return res.redirect('/products/new')
        } else {
            const {productname, price, description} = req.body
            const {path, filename} = req.file
            const product = await new Product (req.body)
      
            if(!product){
                req.flash('error', ' Product is not created...')
                return res.redirect('/products/new')
            } else {
                product.imageUrl = req.file.path
                product.imageId = req.file.filename
            }
            
                const savedProduct = await product.save()
                if(savedProduct) {
                    req.flash('success', ' Product details inserted successfuly')
                    return res.redirect('/products')
                } else {
                    req.flash('error', ' Product details are not inserted')
                    return res.redirect('/products/new')
                }
           }
    } catch(err){
        req.flash('error', err.message)
        res.redirect('/products/new')
    }
}

module.exports.showProduct = async (req, res, next)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            req.flash('error', ' Product not found!!!')
            return res.redirect('/products')
        }
        res.render('products/showproduct', {product})
    } catch(err){
        req.flash('error', err.message)
        res.redirect('/products')
    }
}

module.exports.editProduct = async (req, res)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            req.flash('error', ' Product not found!!!')
            return res.redirect('/products')
        }
        res.render('products/editproduct', {product})
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/products')
    }
}

module.exports.updateProduct = async (req, res)=>{

    try {
        const product = await Product.findById(req.params.id)
        if(product && product.imageId) {
            await cloudinary.uploader.destroy(product.imageId)
        }
        
        const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body)
        if(newProduct) {
            newProduct.imageUrl = req.file.path;
            newProduct.imageId = req.file.filename;
        }
        
        const savednewProduct = await newProduct.save()
        if(savednewProduct) {
            req.flash('success', ' You have successfully updated product details!!!')
            return res.redirect('/products')
        } else {
            req.flash('error', ' product details are not updated!!!')
            return res.redirect('/products')
        }
    } catch(err){
        req.flash('error', err.message)
        res.redirect('/error')
    }
}

module.exports.deleteProduct = async (req, res)=>{
    try {
        const product = await Product.findByIdAndRemove(req.params.id)
        if(!product){
            req.flash('error', ' Product not found!!!')
            return res.redirect('/products')
        }
        req.flash('success', 'Deleted product details...')
        res.redirect('/products')
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/products')
    }
}