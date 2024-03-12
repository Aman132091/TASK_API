require('dotenv').config()
const express = require('express')
const cors = require('cors')
 
const db = require('./DB/db')
const methodoverride = require('method-override')
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const app = express()

app.use(cors())
app.set("view engine", "ejs")

db(DATABASE_URL)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const UserRoute = require('./Routes/UserRoute.js')
app.use('/user',UserRoute)

app.use(methodoverride("_method"))
app.use(methodoverride('X-HTTP-Method-Override'))

const views = require("./Routes/viewRoute")
app.use("/" , views)
// app.get('/',(req,res)=>{
//     res.send("Working")
// })

app.listen(port,()=>{
    console.log(`Server listened at http://localhost:${port}`)

})
