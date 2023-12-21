import express from "express"
import contactsController from "../../controllers/contacts-controler.js";
import {validateBody} from "../../decorators/index.js";
import {isEmptyBody, isValidId} from "../../middlewares/index.js";
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/Contact.js"




const contactsRouter = express.Router()
contactsRouter.get("/", contactsController.getAll);
contactsRouter.get("/:contactId", isValidId, contactsController.getById);
contactsRouter.post("/", isEmptyBody, validateBody(contactAddSchema), contactsController.add);
contactsRouter.put("/:contactId", isValidId, isEmptyBody, validateBody(contactsUpdateSchema), contactsController.updateById);
contactsRouter.patch("/:contactId/favorite", isValidId, isEmptyBody, validateBody(contactUpdateFavoriteSchema), contactsController.updateById);
contactsRouter.delete("/:contactId", isValidId, contactsController.deleteById)




export default contactsRouter;