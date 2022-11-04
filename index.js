import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const port=9004;
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("general", userSchema)  //tuser is collection, it will become plural.

app.get('/', async(req, res) => {
    const act=await User.find()
    
    if(!act){
        res.send("No user") 
    }
    return res.send(act)
})


app.post("/login", (req, res)=> {

    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/signup", (req, res)=> {

    const { name, email, password} = req.body

    User.findOne({email: email}, (err, result) => {   // callback content 2 argument (err and result) 
        if(result){ res.send("user already exist") }
    
        else{
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })   
}) 

app.listen(process.env.PORT || port,async()=>{
    await mongoose.connect(`mongodb+srv://chetan:12345@cluster0.4jf6kcr.mongodb.net/?retryWrites=true&w=majority`)
    console.log(`App start on ${port}`)
})

// app.listen(9002, () => {
//     mongoose.connect("mongodb://localhost:27017/tmetriclogin", {   //tmetriclogin is DB
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => {
//     console.log("DB connected at port 9002")
// })
// })