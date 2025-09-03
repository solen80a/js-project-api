import bcrypt from "bcrypt"

import { User } from "../models/user";

//app.get("/users", async (req, res) => 
export const postUser = async (req, res) => {
  try{
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const salt = bcrypt.genSaltSync()
    const user = new User({email, password: bcrypt.hashSync(password, salt)})
    await user.save()
    res.status(200).json({
      success: true,
      response: email,
      userId:user._id, 
      accessToken: user.accessToken

    })
  } catch(error){
    res.status(400).json({
      message: "Could not create user", 
      errors: error.errors
    })
  }  
}

