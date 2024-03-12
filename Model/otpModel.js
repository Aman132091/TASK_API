const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    userID:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date,

})

const userOtpVerification = mongoose.model('Uov',Schema)
module.exports = userOtpVerification