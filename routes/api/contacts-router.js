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
      res.json(result)
   } catch (error) {
      next(error)
   }
})

contactsRouter.get("/:contactId", async (req, res, next) => {
   try {
      const { contactId } = req.params
      const result = await contactsService.getContactById(contactId)
      if (!result) {
         res.status(404).json({
            message: "Not found"})
      }

      res.json(result)
   } catch (error) {
      next(error)
   }
})

contactsRouter.post("/", async (req, res, next) => {
   try {
      const { error } = joiSchema.validate(req.body)
      if (error) {
         res.status(400).json({
            message: "missing required name field"})
      }

      const { name, email, phone } = req.body
      const result = await contactsService.addContact(name, email, phone)
      res.status(201).json(result)
   } catch (error) {
      next(error)
   }
})

contactsRouter.delete("/:contactId", async (req, res, next) => {
   try {
      const { contactID } = req.params
      const result = await contactsService.removeContact(contactID)
      if (!result) {
         res.status(404).json({
            message: "Not found"})
      }
      res.status(200).json({
         message: "contact deleted"})
   } catch (error) {
      next(error)
   }
})

contactsRouter.put("/:contactId", async (req, res, next) => {
   try {
      const { error } = joiSchema.validate(req.body)
      if (error) {
         res.status(400).json({
            message: "missing fields"})
      }

      const { contactId } = req.params
      const result = await contactsService.updateContact(contactId, req.body)
      if (!result) {
         res.status(404).json({
            message: "Not found"})
      }
      res.status(200).json(result)
   } catch (error) {
      next(error)
   }
})

export default contactsRouter
