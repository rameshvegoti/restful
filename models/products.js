const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const productSchema = new mongoose.Schema({
    productname : {
        type : String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    description : {
        type: String
    },
    imageUrl : {
        type: String
    },
    imageId : {
        type : String
    }    
})

productSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Product', productSchema)