import mongoose from "mongoose";

export const reviewSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
 
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
