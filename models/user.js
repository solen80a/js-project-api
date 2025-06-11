//import bcrypt from "bcrypt"
import crypto from "crypto"
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}) 

export const User = mongoose.model("User", userSchema)

// //Middleware function
// const authenticateUser = async (req, res, next) => {
//   const user = await User.findOne({accessToken: req.header("Authorization")})
//   if(user) {
//     req.user = user
//     next()
//   } else {
//     res.status(401).json({loggedOut: true})
//   }
// }

// app.get("/users", async (req, res) => {
//   try{
//     const { email, password } = req.body
//     const salt = bcrypt.genSaltSync()
//     const user = new User({email, password: bcrypt.hashSync(password, salt)})
//     user.save()
//     res.status(200).json({userId:user._id, accessToken: user.accessToken})
//   } catch(error){
//     res.status(400).json({message: "Could not create user", errors: error.errors})
//   }  
// })

// app.get("/secrets", authenticateUser)

// app.post("/sessions", async (req, res) => {
//   const user = await User.findOne({email: req.body.email})

//   if(user && bcrypt.compareSync(req.body.password, user.password)){
//     res.json({userId: user._id, accessToken: user.accessToken})
//   } else {
//     res.json({notFound: true})
//   }
// })