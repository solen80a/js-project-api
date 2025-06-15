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

