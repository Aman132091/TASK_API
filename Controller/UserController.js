require('dotenv').config()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../Model/UserModel')
const upadteDetail = require('../Model/Updatedetails')
const userDetail = require('../Model/UserDetails')
const otpModel = require('../Model/otpModel')
const transporter = require('../config/emailconfig')




// const signup = async(req,res)=>{
//     const {username,email,password} = req.body

//     const user = await userModel.findOne({email})
//     if(user){
//         res.send({status:"failed",message:"User Already Exists..."})
//     }else{
//         if(username && email && password){

//             try {
//                 const salt = await bcryptjs.genSalt(10)
//                 const hashPassword = await bcryptjs.hash(password,salt)
//                 const newUser = new userModel({
//                     username:username,
//                     email:email,
//                     password:hashPassword
//                 })
//                 await newUser.save()

//                 const savedUser = await userModel.findOne({email})

//                 const token = jwt.sign({userID:savedUser._id},process.env.SECRET_KEY,{expiresIn:'5d'})

//                 await userDetails(req,res)

//                 return res.send({status:"success",message:"Successfully Registered....",token})
//             } catch (error) {

//                 return res.send({status:"failed",message:error.message})
                
//             }
//         }else{

//             return res.send({status:"failed",message:"All Fields Required to Register a User...."})
//         }
//     }
// }

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const user = await userModel.findOne({ email })

        if (user) {
            res.status(400).send({ status: "failed", message: "User Already Exists..." })
        }
        if (!(username && email && password)) {
            res.status(400).send({ status: "failed", message: "All Fields Required to Register a User...." })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = new userModel({
            username: username,
            email: email,
            password: hashPassword
        });

        await newUser.save();

        const savedUser = await userModel.findOne({ email })

        // Call userDetails function to add additional user details
        // await userDetails(req, res);

        const token = jwt.sign({ userID: savedUser._id }, process.env.SECRET_KEY, { expiresIn: '5d' })

        res.status(201).send({ status: "success", message: "Successfully Registered....", token })
    
    } catch (error) 
    {
        console.error(error);
        res.status(500).send({ status: "failed", message: "Internal Server Error" })
    }
};
// const userDetails = async (req, res) => {
//     try {
//         const { name, address } = req.body;

//         if (name && address) {
//             const addDetail = new userDetail({
//                 name: name,
//                 address: address
//             });

//             await addDetail.save();
//             const savedUser = await userModel.findOne({ email });

//             const token = jwt.sign({ userID: savedUser._id }, process.env.SECRET_KEY, { expiresIn: '5d' })


//             res.status(201).send({ status: "success", message: "User details added successfully.",token });
//         } else {
//             res.status(400).send({ status: "failed", message: "Name and address are required to add user details." });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: "failed", message: "Something wrong!" });
//     }
// };




const signin = async(req,res)=>{
    const {email,password} = req.body

    if(email && password){

        const user =await userModel.findOne({email})
        if(user){
            const matchPassword = await bcryptjs.compare(password,user.password)

            if(user.email === email && matchPassword){

                const token = jwt.sign({userID:user._id},process.env.SECRET_KEY,{expiresIn:'5d'})

                res.status(201).send({status:"Success",message:"SignIn Successfully....",token})
            }else{
                res.send({status:"failed",message:"Email or Password not Matched...."})
            }
        }else{
            res.send({status:"failed",message:"Sorry! User Not Exists....Please Resister First"})
        }
    }else{
        res.send({status:"failed",message:"Email or Password Required to SignIn...."})
    }
}

const readUser = async(req,res)=>{
    res.send({"user":req.user})
    // res.send({'Details':req.user})
}

const updatePassword = async (req, res) => {
    const updatepassword = {
        email: req.body.email,
        oldpassword: req.body.oldpassword,
        newpassword: req.body.newpassword
    };

    try {
        const user = await userModel.findOne({ email: updatepassword.email })

        if (!user) {
            res.status(404).send({ status: "failed", message: "User not found." })
        }

        const isMatch = await bcryptjs.compare(updatepassword.oldpassword, user.password)

        if (!isMatch) {
            res.send({ status: "failed", message: "Old password not matched, please provide a correct password or click forget password." });
        }

        const salt = await bcryptjs.genSalt(10)
        const hashNewpassword = await bcryptjs.hash(updatepassword.newpassword, salt)

        user.password = hashNewpassword
        await user.save()

        res.send({ status: "Success", message: "Password successfully updated." })
    } catch (error) {
        console.error("Update Password Error:", error)
        res.status(500).send({ status: "failed", message: "Something went wrong." })
    }
}

const updateEmail = async (req, res) => {
    const {oldemail,newemail,password}= req.body

    try {
        const user = await userModel.findOne({ email:oldemail })
        

        if (!user) {
            res.send({ status: "failed", message: "User not found..." })
        }

        const isMatch = await bcryptjs.compare(password,user.password)
        

        if (!isMatch) {
            res.send({ status: "failed", message: "Old password not matched, please provide a correct password or click forget password." });
        }
        if(user.email === oldemail && isMatch){
            await userModel.updateOne({email:oldemail},{$set:{email:newemail}})
        }

        res.send({ status: "Success", message: "Email successfully updated..." });
    } catch (error) {
        console.error("Update Email Error:", error);
        res.send({ status: "failed", message: "Something went wrong..." });
    }
}

const updateUsername = async(req,res)=>{
        const updateuser = new upadteDetail({
            oldusername:req.body.oldusername,
            newusername:req.body.newusername

        })

        try{

            const match = await userModel.findOne({username:updateuser.oldusername})

            if(!match){

                res.send({status:"fai;ed",message:"user not exists"})

            }
            else{

                await userModel.updateOne({username:updateuser.oldusername},{$set:{username:updateuser.newusername}})
                res.send({status:"success",message:"updated successfully"})

            }
        } 
        catch (error) 
        {
            res.send({status:"failed",message:"Something Went Wrong..."})
            
        }


}     

const deleteUser = async(req,res)=>{
    console.log("I am Here")
    const {email,password} = req.body

    if(email && password){

        const user =await userModel.findOne({email})
        if(user){
            const matchPassword = await bcryptjs.compare(password,user.password)

            if(user.email === email && matchPassword){

                await userModel.deleteOne({email:user.email})

                res.status(201).send({status:"Success",message:"Deleted Successfully...."})
            }else{
                res.send({status:"failed",message:"Email or Password not Matched...."})
            }
        }else{
            res.send({status:"failed",message:"Sorry!!!! User Not Exists..."})
        }
    }else{
        res.send({status:"failed",message:"All fields are Required.."})
    }
}

const sendLink = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            throw new Error("Enter a correct email.");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("User not found.");
        }

        const secret = user._id + process.env.SECRET_KEY;
        const token = await jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' });
        const link = `http://127.0.0.5000/user/verifyandreset/${user._id}/${token}`;

        const sendEmail = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Please Reset Your Password",
            html: `<a href=${link}>Click Here to reset your password</a>`
        });

        res.send({ status: "success", message: "Link sent successfully", sendEmail: sendEmail });
    } catch (error) {
        res.send({ status: "failed", message: error.message });
    }
};

const verifyAndReset = async(req,res)=>{

    const{password} = req.body
    const {id,token} = req.params


         //try/catch(if error exist)\

         
    const user = await userModel.findById(id)
    const newSecret = user._id + process.env.SECRET_KEY

    try {
        jwt.verify(token,newSecret)
        if(password){
            const salt = await bcryptjs.genSalt(10)
            const newhashLinkPassword = await bcryptjs.hash(password,salt)
            
            await userModel.findByIdAndUpdate(user._id,{$set:{password:newhashLinkPassword}})
            res.send({status:"success",message:"Link verified and Password Updated Successfully...."})

        }else{
            res.send({status:"failed",message:"Pasword not matched or Empty"})
        }
    } catch (error) {
        res.send({status:"failed Error : ",message:error.message})
        
    }


}

// const sendOTP = async(req,res)=>{
//     const {email} = req.body

//     if(email){
//         const user = await userModel.findOne({email})

//         if(user){
//             const otp = Math.floor(1000 + Math.random()*9000)

//             try {
//                 const salt = await bcryptjs.genSalt(10)
//                 const hashOTP = await bcryptjs.hash(otp.toString(),salt)
//                 user.otpHash = hashOTP
//                 await user.save()

//                 const sendOtpToUser = await transporter.sendMail({

//                     from: process.env.EMAIL_FROM,
//                     to: user.email,
//                     subject: "OTP for Reset Password",
//                     text: `Your OTP is: ${otp} Expires in 15 min `,

//                 }) 

//                 res.send({status:"success",message:"OTP sent successfully..",sendOtpToUser})
//             } catch (error) {
//                 res.send({status:"failed",message:error.message})
                
//             }
//         }else{
//             res.send({status:"failed",message:"User not found!"})
//         }
//     }else{
//         res.send({status:"failed",message:"Please enter Email or a valid Email..."})
//     }
// }
const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (email) {
        const user = await userModel.findOne({ email });

        if (user) {
            // Generate OTP 
            const otp = Math.floor(1000 + Math.random() * 9000);

            try {
                // Save OTP in model(user)
                const salt = await bcryptjs.genSalt(10);
                const hashedOtp = await bcryptjs.hash(otp.toString(), salt);

                user.otpHash = hashedOtp;
                await user.save();

                // Send OTP to user 
                const info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: "Your OTP for Verification",
                    text: `Your OTP is: ${otp} Expires in 15 min `,
                });

                res.send({
                    status: "success",
                    message: "OTP sent successfully",
                    info, 
                });
            } catch (error) {
                console.log('error:', error);
                res.send({ status: "failed", message: "Error saving OTP" });
            }
        } else {
            res.send({ status: "failed", message: "Email Not found" });
        }
    } else {
        res.send({ status: "failed", message: "Email field is required" });
    }
}

const verifyOTP = async(req,res)=>{
    const {otp,email,newpassword} = req.body

    if(otp && email && newpassword){
        try {
            const user = await userModel.findOne({email})

            if(user){
                const otpVaild = await bcryptjs.compare(otp.toString(),user.otpHash)

                if(otpVaild){
                    const salt = await bcryptjs.genSalt(10)
                    const hashedPassword = await bcryptjs.hash(newpassword,salt)
                    user.password = hashedPassword
                    user.otpHash = undefined
                    await user.save()
                }

                res.send({status:"success",message:"OTP valid and assword updated successfully.."})
            }
        } catch (error) {
            res.send({status:"failed",message:error.message})
            
        }
    }else{
        res.send({status:"failed",message:"Required All Fields..."})
    }
}


module.exports = {signup,signin,readUser,updateUsername,updatePassword,deleteUser,updateEmail,sendLink,verifyAndReset,sendOtp,verifyOTP}