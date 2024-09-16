import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";
import Category from "../models/Category.js";
import fs from "fs";
export const createCategory = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No icon found" });
  const fileFromCloudinary = await uploadImageToCloudinary(req.file,res)
  let category = new Category({
    name: req.body.name,
    icon: fileFromCloudinary?.url,
    color: req.body.color,
    description: req.body.description,
  });
  category = await category.save();

  if (!category)
    return res.status(400).json({ message: "the category cannot be created!" });
  res.status(201).json(category);
};
export const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  res.status(200).json(category);
};
export const getAllCategory = async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(categoryList);
};
export const updateCategory = async (req, res) => {
  const oldCategory = await Category.findById(req.params.id);
  let iconToSet;
  const file = req.file;
  if (file) {
    const isDeleted = await deleteFileFromCloudinary(oldCategory?.icon)
    if (isDeleted){
      const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
      iconToSet = fileFromCloudinary?.url;
    }
  } else {
    iconToSet = req.body.icon;
  }
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: iconToSet,
      color: req.body.color,
      description: req.body.description,
    },
    { new: true }
  );

  if (!category)
    return res.status(400).json({ message: "the category cannot be updated!" });
  res.status(201).json(category);
};
export const deleteCategory = async (req, res) => {
  try {
    const oldCategory = await Category.findById(req.params.id);
    if (oldCategory) {
      const isDeleted = await deleteFileFromCloudinary(oldCategory?.icon)
      if(isDeleted){
        Category.findByIdAndRemove(req.params.id)
          .then((category) => {
            if (category) {
              return res
                .status(200)
                .json({ success: true, message: "The category is deleted!" });
            } else {
              return res
                .status(404)
                .json({ success: false, message: "category not found!" });
            }
          })
          .catch((err) => {
            return res.status(500).json({ success: false, error: err });
          });
      }else{
        res
          .status(500)
          .json({ message: "Not able to delete image" });
      }
    }else{
      res
        .status(500)
        .json({ message: "Not found any category" });

    }
   
  } catch (error) {
      res
      .status(500)
      .json({ message: "Internal server error" });
    
  }
 
};
