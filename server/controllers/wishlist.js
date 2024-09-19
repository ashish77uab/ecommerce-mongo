import WishListItem from "../models/WishListItem.js";
export const addToWishList = async (req, res) => {
 try {
   const { product } = req.body;
   const user = req.user;
   const wishlistItem = await WishListItem.create({
     product,
     user: user.id,
   });
   if (!wishlistItem) {
     res.status(500).json({ success: false });
   }
   res.status(200).json(wishlistItem);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const getAllWishistItem = async (req, res) => {
 try {
   const user = req.user;
   const wishlistItems = await WishListItem.find({
     user: user.id,
   }).populate("product");
   if (!wishlistItems) {
     res.status(500).json({ success: false });
   }
   res.status(200).json(wishlistItems);
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
export const removeFromWishList = async (req, res) => {
 try {
   const user = req.user;
   WishListItem.findByIdAndRemove(req.params.id)
     .then((item) => {
       if (item) {
         return res.status(200).json({
           success: true,
           message: "Removed Successfully!",
         });
       } else {
         return res
           .status(404)
           .json({ success: false, message: "Product not found!" });
       }
     })
     .catch((err) => {
       return res.status(500).json({ success: false, error: err });
     });
 } catch (error) {
   return res.status(500).json({message: 'Internal server error'});
 }
};
