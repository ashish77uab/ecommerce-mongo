import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";
import Review from "../models/Review.js";

export const editReviewForProduct = async (req, res) => {
  try {
    const reviewId = req.params?.reviewId
    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        ...req?.body,
      },
      { new: true }
    );
    if (!review)
      return res.status(500).json({ message: "Unable to update review for this product" });
    res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
};
export const createReviewForProduct = async (req, res) => {
  try {
    const user = req.user
    let review = new Review({
      ...req.body,
      user: user?.id
    });
    review = await review.save();
    if (!review)
      return res.status(500).json({ message: "Unable to create review for this products" });
    res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
};
export const createProduct = async (req, res) => {
 try {
   const category = await SubCategory.findById(req.body.subCategory);
   if (!category) return res.status(400).send("Invalid Category");
   const files = req.files;
   if (files?.length < 1) return res.status(400).json({ message: "No images uploaded" });
   let imagesPaths = [];
   let tempPath = []
   if (files?.length > 0) {
     files.forEach(async (file) => {
       tempPath.push(uploadImageToCloudinary(file, res))
     });
     const tempImagePaths = await Promise.all(tempPath)
     imagesPaths = tempImagePaths.map((path) => path.url);
   }
   let product = new Product({
     ...req.body,
     images: imagesPaths,
   });

   product = await product.save();

   if (!product)
     return res.status(500).json({ message: "Unable to create product" });
   res.status(201).json(product);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getProduct = async (req, res) => {
 try {
   const productId = mongoose.Types.ObjectId(req.params.id); // Convert id to ObjectId
   const product = await Product.aggregate([
     {
       $match: { _id: productId }, // Match the product by its ID
     },
     {
       $lookup: {
         from: "subcategories", // Join with the SubCategory collection
         localField: "subCategory",
         foreignField: "_id",
         as: "subCategory",
       },
     },
     {
       $unwind: {
         path: "$subCategory", // Unwind the subCategory field
         preserveNullAndEmptyArrays: true,
       },
     },
     {
       $lookup: {
         from: "reviews", // Join with the Review collection
         localField: "_id", // Product ID in Review schema
         foreignField: "product", // Product field in Review schema
         as: "reviews", // Output as reviews
       },
     },
     {
       $unwind: {
         path: "$reviews", // Unwind reviews array if needed
         preserveNullAndEmptyArrays: true,
       },
     },

     {
       $lookup: {
         from: "users", // Join with the User collection for review author
         localField: "reviews.user",
         foreignField: "_id",
         as: "reviews.userDetails", // Add user details to each review
       },
     },
     {
       $unwind: {
         path: "$reviews.userDetails", // Unwind user details for each review
         preserveNullAndEmptyArrays: true,
       },
     },

     {
       $group: {
         _id: "$_id", // Group back to the product document
         name: { $first: "$name" },
         description: { $first: "$description" },
         richDescription: { $first: "$richDescription" },
         price: { $first: "$price" },
         countInStock: { $first: "$countInStock" },
         liveWatchCount: { $first: "$liveWatchCount" },
         numReviews: { $first: "$numReviews" },
         isFeatured: { $first: "$isFeatured" },
         images: { $first: "$images" },
         brand: { $first: "$brand" },
         subCategory: { $first: "$subCategory" }, // Include subCategory data
         reviews: { $push: "$reviews" }, // Collect all reviews
         averageRating: { $avg: "$reviews.rating" },
       },
     },
   ]);
   const result = product[0];
   if (result.averageRating === null) {
     result.reviews = [];
   }

   res.status(200).json(result);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
  
 }
};
export const getFeaturedProduct = async (req, res) => {
 try {
   const product = await Product.find({ isFeatured: true }).populate(
     "subCategory"
   );

   if (!product) {
     res.status(500).json({ message: "Product not found" });
   }
   res.status(200).json(product);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getBrands = async (req, res) => {
 try {
   const product = await Product.aggregate([
     {
       $group: {
         _id: "$brand",
         //   detail: { $push : "$$ROOT" },
       },
     },
     {
       $addFields: { brandName: "$_id" }
     },
     {
       $project: { _id: 0 }
     }

   ]);

   if (!product) {
     res.status(500).json({ message: "Products not found" });
   }
   res.status(200).json(product);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getStats = async (req, res) => {
 try {
   const productCount = await Product.find().countDocuments();
   const brands = await Product.aggregate([
     {
       $group: {
         _id: "$brand",
       },

     },
     {
       "$count": "total"
     }


   ]);

   if (!brands) {
     res.status(500).json({ message: "Products not found" });
   }
   res.status(200).json({ totalProduct: productCount, totalBrands: brands });
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getAllProduct = async (req, res) => {
 
  try {
    const { min, max, category, sort } = req.query;

    const categoryArray = category ? category?.split(',')?.length > 0 ? category?.split(',') : [category] : [];

    const priceFilter = {};
    if (min) priceFilter.$gte = Number(min);
    if (max) priceFilter.$lte = Number(max);
    const sortOrder = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null;
    const pipeline = [
      {
        $lookup: {
          from: 'subcategories', // Name of the SubCategory collection in your DB
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategoryInfo',
        },
      },
      {
        // Unwind subCategory but preserve documents even if subCategoryInfo is null
        $unwind: {
          path: '$subCategoryInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories', // Name of the Category collection in your DB
          localField: 'subCategoryInfo.category',
          foreignField: '_id',
          as: 'subCategoryInfo.categoryInfo',
        },
      },
      {
        // Unwind category but preserve documents even if categoryInfo is null
        $unwind: {
          path: '$subCategoryInfo.categoryInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: categoryArray.length > 0 ? { 'subCategoryInfo.categoryInfo._id': { $in: categoryArray.map(id => mongoose.Types.ObjectId(id)) } } : {},
      },
      {
        $match: Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {},
      }
    ];
    if (sortOrder !== null) {
      pipeline.push({ $sort: { price: sortOrder } });
    }

    const productList = await Product.aggregate(pipeline);




    // Return the filtered product list
    res.status(200).json(productList);
  } catch (err) {
    return res.status(500).json({message: 'Internal server error'});
  }
};
export const updateProduct = async (req, res) => {
 try {
   if (!mongoose.isValidObjectId(req.params.id)) {
     return res.status(400).json({ message: "Invalid Product Id" });
   }
   const oldProduct = await Product.findOne({ _id: req.params.id });
   const oldImages = oldProduct.images;
   const files = req.files;
   let imagesPaths = [...oldImages];
   if (files?.length > 0) {
     let totalImages = files.length + oldImages.length;
     if (totalImages > 10) {
       res.status(500).json({ message: "Total 10 Images are allowed " });
     } else {
       let tempPath = []
       files.forEach(async (file) => {
         tempPath.push(uploadImageToCloudinary(file, res))
       });
       const tempImagePaths = await Promise.all(tempPath)
       const allUploadedPaths = tempImagePaths.map((path) => path.url);
       imagesPaths = imagesPaths.concat(allUploadedPaths);;
     }
   }
   let data = { ...req.body };
   delete data.images;
   const product = await Product.findByIdAndUpdate(
     req.params.id,
     {
       ...data,
       images: imagesPaths,
     },
     { new: true }
   );
   if (!product)
     return res.status(500).json({ message: "The product cannot be updated!" });

   res.status(201).json(product);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const deleteProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findOne({ _id: req.params.id });
    const oldImages = oldProduct.images;
    let tempPath = [];
    if (oldImages?.length > 0) {
      oldImages.forEach(async (url) => {
        tempPath.push(deleteFileFromCloudinary(url, res))
      });
      const tempImagePaths = await Promise.all(tempPath)
    }
    Product.findByIdAndRemove(req.params.id)
      .then((product) => {
        if (product) {
          return res.status(200).json({
            success: true,
            message: "the product is deleted!",
          });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "product not found!" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });

  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }

};
export const deleteProductImage = async (req, res) => {
  try {
    const imgPath = req.body.imgPath;
    const oldProduct = await Product.findOne({ _id: req.params.id });
    const oldImages = oldProduct.images;
    const isDeleted = await deleteFileFromCloudinary(imgPath)
    if (isDeleted) {
      const imagesPaths = oldImages.filter((file) => {
        if (file === imgPath) {
          return false;
        } else {
          return true;
        }
      });
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagesPaths,
        },
        { new: true }
      );
      res.status(200).json({ success: true });
    } else {
      res.status(500).send("The image cannot be deleted by cloudinary!")
    }

  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }


};
export const updateProductCount = async (productId, count) => {
  try {
    // Check if productId is valid
    if (!mongoose.isValidObjectId(productId)) {
      return { status: 400, message: "Invalid Product Id" };
    }

    // Update the product's liveWatchCount
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { liveWatchCount: count } },
      { new: true } // Option to return the updated product
    );

    // Check if product was found and updated
    if (!product) {
      return { status: 404, message: "Product not found" };
    }

    return { status: 200, product };
  } catch (error) {
    // Handle errors and return error message
    return { status: 500, message: error.message };
  }
};
