// exports.home = async(req,res)=>{
//     res.render('homepage')
// }
//readUser,updatePassword,updateEmail,updateUsername,deleteUser,sendLink,verifyAndReset
exports.signup = async (req , res)=>{
    res.render('signup')
}

exports.signin = async(req,res)=>{
    res.render('signin')
}

exports.updatePassword= async(req,res)=>{
    res.render('updatepassword')
}

exports.updateEmail= async(req,res)=>{
    res.render('updateEmail')
}

exports.sendLink = async(req,res)=>{
    res.render('forgetpassword')
}

exports.verifyAndReset = async(req,res)=>{
    res.render('resetpassword')
}

exports.updateUsername= async(req,res)=>{
    res.render('updateusername')
}

exports.deleteUser= async(req,res)=>{
    res.render('deleteuser')
}

exports.readUser= async(req,res)=>{
    res.render('getUserDetails')
}