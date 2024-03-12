const express = require('express')
const router = express.Router()
const UserController = require('../Controller/UserController')
const checkAuth = require('../Middleware/UserMiddleware')

router.get('/')

router.use('/readuser',checkAuth)

router.post('/signup',UserController.signup)
// router.post('/adddetails',UserController.userDetails)
// router.post('/combine',UserController.combine)
router.post('/signin',UserController.signin)
router.post('/sendlink',UserController.sendLink)
router.post('/sendotp',UserController.sendOtp)
router.post('/verifyotp',UserController.verifyOTP)

router.get('/readuser',UserController.readUser)
router.post('/verifyandreset/:id/:token',UserController.verifyAndReset)

router.put('/updateusername',UserController.updateUsername)
router.put('/updatepass',UserController.updatePassword)
router.put('/updateemail',UserController.updateEmail)

// router.get('/getdetails',UserController.registerUser)

router.delete('/delete',UserController.deleteUser)
// router.post('/sendlink',UserController.sendLink)

module.exports = router