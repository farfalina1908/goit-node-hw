import express from "express"
import authController from "../../controllers/auth-controller.js"
import {isEmptyBody, isValidId} from "../../middlewares/index.js"
import { validateBody } from "../../decorators/index.js"
import {userSignupSchema, userSigninSchema} from "../../models/User.js"

const authRouter = express.Router()

authRouter.post("/users/register", isEmptyBody, validateBody(userSignupSchema), authController.signup)
authRouter.post("/users/login", isEmptyBody, validateBody(userSigninSchema), authController.signin)

export default authRouter;
