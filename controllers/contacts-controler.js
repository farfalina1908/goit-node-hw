import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";


const getAll = async (req, res, next) => {
   const { _id: owner } = req.user;
   const { page = 1, limit = 10 } = req.query;
   const skip = (page - 1) * limit;
   
       try {
          const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email")
          res.json(result)
       } catch (error) {
          next(error)
       }
    }


const getById = async (req, res, next) => {
   try {
       const { id: _id } = req.params;
       const { _id: owner } = req.user;
      const result = await Contact.findOne({ _id, owner })
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
          };
       
       res.json(result)
    } catch (error) {
       next(error)
    }
 }

 const add = async (req, res, next) => {
    try {
      const { _id: owner } = req.user;
       const result = await Contact.create({ ...req.body, owner })
       res.status(201).json(result)
    } catch (error) {
       next(error)
    }
 }


const updateById = async (req, res, next) => {
   try {
        const { id: _id } = req.params;
        const { _id: owner } = req.user;
       const result = await Contact.findOneAndUpdate({_id, owner}, req.body);
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
       }
       res.status(200).json(result)
    } catch (error) {
       next(error)
    }
 }

const updateStatusContact = async (req, res, next) => {
   try {
        const { id: _id } = req.params;
        const { _id: owner } = req.user;
       const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
       }
       res.status(200).json(result)
    } catch (error) {
       next(error)
    }
 }

const deleteById = async (req, res, next) => {
   try {
       const { id: _id } = req.params;
       const { _id: owner } = req.user;
       const result = await Contact.findOneAndDelete({ _id, owner });
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
       }
 
       res.json({
          message: "Contact deleted"})
    } catch (error) {
       next(error)
    }
 }


export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(deleteById),
}