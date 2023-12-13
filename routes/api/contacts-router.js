import express from "express"
import Joi from "joi"
import contactsService from "../../models/contacts/index.js"

const joiSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required(),
   phone: Joi.string().required(),
})

const contactsRouter = express.Router()

contactsRouter.get("/", async (req, res, next) => {
   try {
      const result = await contactsService.listContacts()
      res.json({
         status: "success",
         code: 200,
         data: { result },
      })
   } catch (error) {
      next(error)
   }
})

contactsRouter.get("/:contactId", async (req, res, next) => {
   res.json({ message: "template message" })
})

contactsRouter.post("/", async (req, res, next) => {
   res.json({ message: "template message" })
})

contactsRouter.delete("/:contactId", async (req, res, next) => {
   res.json({ message: "template message" })
})

contactsRouter.put("/:contactId", async (req, res, next) => {
   res.json({ message: "template message" })
})

export default contactsRouter
