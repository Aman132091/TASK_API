const mongoose = require('mongoose')

const updateSchema = new mongoose.Schema({
    oldpassword:{
        type:String,
    },
    newpassword:{
        type:String
    },

    oldusername:{
        type:String
    },
    newusername:{
        type:String
    },
    
    oldemail:{
        type:String
    },
    newemail:{
        type:String
    },
    
})

const updateUser = mongoose.model('update',updateSchema)
module.exports = updateUser