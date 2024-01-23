import {Schema, model} from "mongoose"
import Joi from "joi"
import {handleSaveError, addUpdateSettings} from "./hooks.js";


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
   {
      password: {
         type: String,
         required: [true, "Password is required"],
         minlength: 6,
      },
      email: {
         type: String,
         match: emailRegexp,
         required: [true, "Email is required"],
         unique: true,
      },
      avatarURL: {
         type: String,
         required: [true, "Avatar is required"],
       },
      subscription: {
         type: String,
         enum: subscriptionList,
         default: "starter",
      },
      token: {
         type: String,
         default: null,
      },
      verify: {
         type: Boolean,
         default: false,
     },
  
   verificationToken: {
      type: String,
      
  }
   },
   { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),

})

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string(),
})

export const userEmailSchema = Joi.object({
   email: Joi.string().pattern(emailRegexp).required(),
})

const User = model("user", userSchema);

export default User;