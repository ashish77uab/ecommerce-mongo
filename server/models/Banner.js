import mongoose from "mongoose";

const BannerSchema = mongoose.Schema(
  {
   
    homeBanner: [
      {
        type: String,
      },
    ],
   
  },
  { timestamps: true }
);

export default mongoose.model("Banner", BannerSchema);
