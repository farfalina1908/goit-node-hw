import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar"
import fs from "fs/promises"
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import User from "../models/User.js"

import {HttpError, sendEmail} from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const {JWT_SECRET, BASE_URL} = process.env;


const signup = async(req, res)=>{

const {email, password} = req.body
const user = await User.findOne({email})


if (user) {
    throw HttpError(409, "Email already in use")
}

const avatarURL = gravatar.url(email);

const hashPassword = await bcrypt.hash(password, 10)

const verificationToken = nanoid()


const newUser = await User.create({...req.body, password: hashPassword, verificationToken, avatarURL,})

const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href = "${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
}

await sendEmail(verifyEmail)

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        }
   
})
}

const verify = async(req, res) => {

const {verificationToken} = req.params;

const user = await User.findOne({verificationToken})
if(!user){
    throw HttpError(404, "Email not found or already verified")
}

await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });


res.json({
    message: "Email successfully verified"
})
}

const resendVerifyEmail = async(req, res) => {
const {email} = req.body;
const user = await User.findOne({email});
if (!user) {
    throw HttpError(404, "Email not found")
}
if(user.verify) {
    throw HttpError(400, "Email is already verified")
}
const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href = "${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
}
await sendEmail(verifyEmail);
res.json({
    message: "Verify email send success"
})
}

const signin = async(req, res)=> {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw HttpError(401, "Email or password is wrong")
    }

    if(!user.verify) {
        throw HttpError(401, "Email not verified")
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
     
   const { email, subscription } = req.user;

   res.json({
         email,
         subscription,    
   });
};

const signout = async (req, res) => {
   const { _id:id } = req.user;
   const result = await User.findById(id);
   if (!result) {
       throw HttpError(401, { message: "Not authorized" });
   }
   await User.findByIdAndUpdate(id, { token: "" });

   res.status(204).json("No Content"
   );
};

const avatarDir = path.resolve("public", "avatars");


const updateAvatar = async (req, res) => {
    const { _id: id } = req.user;
    
if (!req.file) {
   return res
      .status(400)
      .json({ error: "No file provided for avatar update." });
}

  const { path: tempUpload, originalname } = req.file;
 
  
  const imageName = `${id}_${originalname}`;
  
  try {
    const resultUpload = path.join(avatarDir, imageName);
    await fs.rename(tempUpload, resultUpload);
    const file = await Jimp.read(resultUpload);
    await file.resize(250, 250).write(resultUpload);
    const avatarURL = path.join("avatars", imageName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

export default {
   signup: ctrlWrapper(signup),
   verify: ctrlWrapper(verify),
   resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
   signin: ctrlWrapper(signin),
   getCurrent: ctrlWrapper(getCurrent),
   signout: ctrlWrapper(signout),
   updateAvatar: ctrlWrapper(updateAvatar),
};