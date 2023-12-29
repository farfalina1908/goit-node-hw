import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../models/User.js"

import {HttpError} from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const {JWT_SECRET} = process.env

const signup = async(req, res)=>{

const {email, password} = req.body
const user = await User.findOne({email})
if (user) {
    throw HttpError(409, "Email already in use")
}
const hashPassword = await bcrypt.hash(password, 10)

const newUser = await User.create({...req.body, password: hashPassword})

res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
})
}

const signin = async(req, res)=> {}


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
}