import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";
import SubCategory from "../models/SubCategory.js";
export const createSubCategory = async (req, res) => {
 try {
   const file = req.file;
   if (!file) return res.status(400).json({ message: "No icon found" });
   const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
   let category = new SubCategory({
     name: req.body.name,
     icon: fileFromCloudinary?.url,
     color: req.body.color,
     category: req.body.category,
     description: req.body.description,
   });
   category = await category.save();

   if (!category)
     return res.status(400).json({ message: "the category cannot be created!" });

   res.status(201).json(category);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getSubCategory = async (req, res) => {
 try {
   const category = await SubCategory.findById(req.params.id);
   if (!category) {
     res
       .status(500)
       .json({ message: "The category with the given ID was not found." });
   }
   res.status(200).json(category);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getAllSubCategory = async (req, res) => {
 try {
   const { id } = req.body;
   const categoryList = await SubCategory.find({ category: id });

   if (!categoryList) {
     res.status(500).json({ success: false });
   }
   res.status(200).json(categoryList);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getAllSubCategories = async (req, res) => {
    try {
      const categoryList = await SubCategory.find({});

      if (!categoryList) {
        res.status(500).json({ success: false });
      }
      res.status(200).json(categoryList);
    } catch (error) {
      return res.status(500).json({message: 'Internal server error'});
    }
  };
export const updateSubCategory = async (req, res) => {
 try {
   const oldCategory = await SubCategory.findById(req.params.id);
   let iconToSet;
   const file = req.file;
   if (file) {
     const isDeleted = await deleteFileFromCloudinary(oldCategory?.icon)
     if (isDeleted) {
       const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
       iconToSet = fileFromCloudinary?.url;
     }
   } else {
     iconToSet = req.body.icon;
   }
   const category = await SubCategory.findByIdAndUpdate(
     req.params.id,
     {
       name: req.body.name,
       icon: iconToSet,
       color: req.body.color,
       category: req.body.category,
       description: req.body.description,
     },
     { new: true }
   );

   if (!category)
     return res.status(400).json({ message: "the category cannot be updated!" });
   res.status(201).json(category);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const deleteSubCategory = async (req, res) => {
  try {
    const oldSubCategory = await SubCategory.findById(req.params.id);
    if (oldSubCategory) {
      const isDeleted = await deleteFileFromCloudinary(oldSubCategory?.icon)
      if (isDeleted) {
        SubCategory.findByIdAndRemove(req.params.id)
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
      } else {
        res
          .status(500)
          .json({ message: "Not able to delete image" });
      }
    } else {
      res
        .status(500)
        .json({ message: "Not found any category" });

    }

  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});

  }
};
