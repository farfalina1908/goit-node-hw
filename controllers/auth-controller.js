import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/User.js"

import {HttpError} from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const {JWT_SECRET} = process.env;

const signup = async(req, res)=>{

const {email, password} = req.body
const user = await User.findOne({email})
if (user) {
    throw HttpError(409, "Email already in use")
}
const hashPassword = await bcrypt.hash(password, 10)

const newUser = await User.create({...req.body, password: hashPassword})

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
   
})
}

const signin = async(req, res)=> {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw HttpError(401, "Email or password is wrong")
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }

    const {_id: id} = user;
    const payload = {
        id
    };

    const token =jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
await User.findByIdAndUpdate(id, { token });
    console.log(token)
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
          },
        
    })

}

const getCurrent = async (req, res) => {
    //  const { _id: id } = req.user;
    //  const result = await User.findById(id);
    //  if (!result) {
    //     throw HttpError(401, { message: "Not authorized" });
    // }
    
   const { email, subscription } = req.user;

   res.json({
      user: {
         email,
         subscription,
      },
   });
};

const signout = async (req, res) => {
   const { _id:id } = req.user;
   const result = await User.findById(id);
   if (!result) {
       throw HttpError(401, { message: "Not authorized" });
   }
   await User.findByIdAndUpdate(_id, { token: "" });

   res.status(204).json("No Content"
   );
};


// DB_HOST = mongodb+srv://Olena:GWNQo3zH74tipkTP@cluster0.ml9cauf.mongodb.net/db-contacts?retryWrites=true&w=majority
// PORT = 3000
// JWT_SECRET = N4IYsWBXXWQNnFoCubc2MSFjtxk5LMy9

export default {
   signup: ctrlWrapper(signup),
   signin: ctrlWrapper(signin),
   getCurrent: ctrlWrapper(getCurrent),
   signout: ctrlWrapper(signout),
};