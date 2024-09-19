import Banner from "../models/Banner.js";
import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";
import { BANNERS_VALUE } from "../utils/constant.js";
export const createBanner = async (req, res) => {
 try {
   const files = req.files;
   const type = req.body.type;
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
   let banner = new Banner({
     ...req.body,
     [type]: imagesPaths,
   });

   banner = await banner.save();

   if (!banner)
     return res.status(500).json({ message: "Unable to create banner" });

   res.status(201).json(banner);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getAllBanner = async (req, res) => {
 try {
   const banners = await Banner.find();
   let tempBanner = [];
   if (!banners) {
     res.status(500).json({ message: "Banner not found" });
   }
   if (banners?.length > 0) {
     tempBanner = Object.keys(BANNERS_VALUE)?.map((type) => {
       return {
         type,
         images: banners?.[0]?.[type],
         id: banners?.[0]?._id
       }
     })
   }

   res.status(200).json(tempBanner);
 } catch (error) {
   return res.status(500).json({ message: 'Internal server error'});
  
 }
};

export const updateBanner = async (req, res) => {
 try {
   const type = req.body.type;
   const oldBanner = await Banner.findOne({ _id: req.params.id });
   const oldImages = oldBanner[type];
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
   const banner = await Banner.findByIdAndUpdate(
     req.params.id,
     {
       ...data,
       [type]: imagesPaths,
     },
     { new: true }
   );
   if (!banner)
     return res.status(500).json({ message: "The banner cannot be updated!" });

   res.status(201).json(banner);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
  
 }
};

export const deleteBannerImage = async (req, res) => {
 try {
   const type = req.body.type;
   const imgPath = req.body.imgPath;
   const oldBanner = await Banner.findOne({ _id: req.params.id });
   console.log(oldBanner,'oldBanner')
   const oldImages = oldBanner[type];
   const isDeleted = await deleteFileFromCloudinary(imgPath)
   if (isDeleted) {
     const imagesPaths = oldImages.filter((file) => {
       if (file === imgPath) {
         return false;
       } else {
         return true;
       }
     });
     const banner = await Banner.findByIdAndUpdate(
       req.params.id,
       {
         [type]: imagesPaths,
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
