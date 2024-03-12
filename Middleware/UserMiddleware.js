const userModel = require("../Model/UserModel")
// const UserController = require('../Controller/UserController')
const jwt = require('jsonwebtoken')

const checkAuth = async(req,res,next)=>{
    let token 
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1]
            const {userID} = await jwt.verify(token,process.env.SECRET_KEY)
            req.user = await userModel.findById(userID).select('-password')
            console.log({message:"Below the user details : ",user:req.user}) // for terminal if want remove it
            
            next()
        } catch (error) {
            res.send({status:"failed",message:"Failed to read Data...."})
        }
    }else{
        res.send({status:"failed",message:"Authorization not matched....Required Token"})
    }
}

module.exports = checkAuth