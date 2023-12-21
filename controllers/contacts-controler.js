import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";


const getAll = async (req, res, next) => {
   
       try {
          const result = await Contact.find({}, "-createdAt -updatedAt")
          res.json(result)
       } catch (error) {
          next(error)
       }
    }


const getById = async (req, res, next) => {
    try {
       const { id } = req.params
       const result = await Contact.findById(id)
       if (!result) {

        throw HttpError(404, `Contact with id=${id} not found`);
        //   res.status(404).json({
        //      message: "Not found",
          };
       
       res.json(result)
    } catch (error) {
       next(error)
    }
 }

 const add = async (req, res, next) => {
    try {
    //    const { error } = contactAddSchema.validate(req.body);
    //    if (error) {
    //       res.status(400).json({message: error.message,})
    //    }
       const result = await Contact.create(req.body)
       res.status(201).json(result)
    } catch (error) {
       next(error)
    }
 }


const updateById = async (req, res, next) => {
    try {
 
    //    const {length} = Object.keys(req.body);
    //    if(!length) {
    //        return  res.status(400).json({
    //          message: "missing fields"});
    //    }
      
    //    const { error } = contactUpdateSchema.validate(req.body);
    //    if (error) {
    //       res.status(400).json({message: error.message,}
    //       )
    //    }
 
       const { id } = req.params
       const result = await Contact.findByIdAndUpdate(id, req.body);
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);

        //   res.status(404).json({
        //      message: "Not found"})
       }
       res.status(200).json(result)
    } catch (error) {
       next(error)
    }
 }

const updateStatusContact = async (req, res, next) => {
    try {
 
    //    const {length} = Object.keys(req.body);
    //    if(!length) {
    //        return  res.status(400).json({
    //          message: "missing fields"});
    //    }
      
    //    const { error } = contactUpdateFavoriteSchema.validate(req.body);
    //    if (error) {
    //       res.status(400).json({message: error.message,}
    //       )
    //    }
 
       const { id } = req.params;
       const result = await Contact.findByIdAndUpdate(id, req.body);
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);

        //   res.status(404).json({
        //      message: "Not found"})
       }
       res.status(200).json(result)
    } catch (error) {
       next(error)
    }
 }

const deleteById = async (req, res, next) => {
    try {
       const { id } = req.params;
       console.log(req.params);
       const result = await Contact.findByIdAndDelete(id);
       if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);

        //   return res.status(404).json({
        //      message: "Not found"})
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