const express = require("express")
const route = express.Router()
const {signup,signin,readUser,updatePassword,updateEmail,updateUsername,deleteUser,sendLink,verifyAndReset}= require("../Controller/viewController")

route.get("/signup" , signup)
route.get('/signin', signin)
route.get('/readuser',readUser)
route.get('/updatepassword',updatePassword)
route.get('/updateemail',updateEmail)
route.get('/updateusername',updateUsername)
route.get('/deleteuser',deleteUser)
route.get('/sendlink',sendLink)
route.get('/verifyandreset',verifyAndReset)

module.exports = route