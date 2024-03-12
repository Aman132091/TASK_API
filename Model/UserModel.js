const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        index:true,
        required:true
    },

    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    otpHash:{
        type:String
    }

},{timestamps:true})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel