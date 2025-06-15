import bcrypt from "bcrypt"
import { response } from "express";

import { User } from "../models/user";

//app.get("/users", async (req, res) => 
export const postUser = async (req, res) => {
  try{
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync()
    const user = new User({email, password: bcrypt.hashSync(password, salt)})
    user.save()
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

