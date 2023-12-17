import express from "express"
import Joi from "joi"
import contactsService from "../../models/contacts/index.js"

const contactAddSchema = Joi.object({
   name: Joi.string().required().messages({
      "any.required": `Required field "name" must be exist`
   }),
   email: Joi.string().required().messages({
      "any.required": `Required field "email" must be exist`
   }),
   phone: Joi.string().required().messages({
      "any.required": `Required field "phone" must be exist`
   }),
});

const contactUpdateSchema = Joi.object({
   name: Joi.string(),
   email: Joi.string(),
   phone: Joi.string(),
});


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
            message: "Not found",
         });
      }

      res.json(result)
   } catch (error) {
      next(error)
   }
})

contactsRouter.post("/", async (req, res, next) => {
   try {
      const { error } = contactAddSchema.validate(req.body);
      if (error) {
         res.status(400).json(
            error.message
         )
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
      const { contactId } = req.params
      console.log(req.params);
      const result = await contactsService.removeContact(contactId);
      if (!result) {
         return res.status(404).json({
            message: "Not found"})
      }

      res.json({
         message: "Contact deleted"})
   } catch (error) {
      next(error)
   }
})

contactsRouter.put("/:contactId", async (req, res, next) => {
   try {
      const { error } = contactUpdateSchema.validate(req.body);
      if (error) {
         res.status(400).json(error.message
         )
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
