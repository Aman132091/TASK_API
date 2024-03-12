const mongoose = require('mongoose')

const detailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    address:{
        type:String,
    },
    otpHash:{
        type:String
    }
},{timestamps:true})

const userDetails = mongoose.model('Details',detailSchema)

module.exports = userDetails