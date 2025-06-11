import bcrypt from "bcrypt"
import { response } from "express";

import { User } from "../models/user";

// export const postUser async (req, res) => {
//   try{
//     const {email, password} = req.body
//     const salt = bcrypt.genSaltSync()

//     const user = new User({ email, password: bcrypt.hashSync(password, salt) })
//     await user.save()

//     res.status(200).json({
//       success: true,
//       message: "User created succesfully",
//       response: {
//         id: user._id,
//         accessToken: user.accessToken
//       }

//     })

//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to create user",
//       response: error
//     })
//   }
// }



//app.get("/users", async (req, res) => 
export const postUser = async (req, res) => {
  try{
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync()
    const user = new User({email, password: bcrypt.hashSync(password, salt)})
    user.save()
    res.status(200).json({userId:user._id, accessToken: user.accessToken})
  } catch(error){
    res.status(400).json({message: "Could not create user", errors: error.errors})
  }  
}

