import express from "express"
import contactsController from "../../controllers/contacts-controler.js";
import {validateBody} from "../../decorators/index.js";
import {authenticate, isEmptyBody, isEmptyField, isValidId} from "../../middlewares/index.js";
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/Contact.js"




const contactsRouter = express.Router()
contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);
contactsRouter.get("/:id", isValidId, contactsController.getById);
contactsRouter.post("/", isEmptyBody, validateBody(contactAddSchema), contactsController.add);
contactsRouter.put("/:id", isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById);
contactsRouter.patch(
   "/:id/favorite",
   isValidId,
   isEmptyField,
   validateBody(contactUpdateFavoriteSchema),
   contactsController.updateStatusContact
);
contactsRouter.delete("/:id", isValidId, contactsController.deleteById)




export default contactsRouter;