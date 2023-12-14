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
         data: { contacts: result },
      })
   } catch (error) {
      next(error)
   }
})

contactsRouter.get("/:contactId", async (req, res, next) => {
   try {
      const { contactId } = req.params
      const result = await contactsService.getContactById(contactId)
      if (!result) {
         res.json({
            message: "Not found",
            status: "error",
            code: 404,
         })
      }
      res.json({
         status: "success",
         code: 200,
         data: {
            result,
         },
      })
   } catch (error) {
      next(error)
   }
})

contactsRouter.post("/", async (req, res, next) => {
   try {
      const { error } = joiSchema.validate(req.body)
      if (error) {
         res.json({
            message: "missing required name field",
            status: "error",
            code: 400,
         })
      }

      const { name, email, phone } = req.body
      const result = await contactsService.addContact(name, email, phone)
      res.status(201).json({
         status: "success",
         code: 201,
         data: {
            result,
         },
      })
   } catch (error) {
      next(error)
   }
})

contactsRouter.delete("/:contactId", async (req, res, next) => {
   try {
      const { contactID } = req.params
      const result = await contactsService.removeContact(contactID)
      if (!result) {
         res.json({
            message: "Not found",
            status: "error",
            code: 404,
         })
      }
      res.json({
         message: "contact deleted",
         status: "success",
         code: 200,
         data: {
            result,
         },
      })
   } catch (error) {
      next(error)
   }
})

contactsRouter.put("/:contactId", async (req, res, next) => {
   try {
      const { error } = joiSchema.validate(req.body)
      if (error) {
         res.json({
            message: "missing fields",
            status: "error",
            code: 400,
         })
      }
      const { contactId } = req.params
      const result = await contactsService.updateContact(contactId, req.body)
      if (!result) {
         res.json({
            message: "Not found",
            status: "error",
            code: 404,
         })
      }
      res.json({
         status: "success",
         code: 200,
         data: {
            result,
         },
      })
   } catch (error) {
      next(error)
   }
})

export default contactsRouter
