import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import User from "../models/User.js";
import Token from "../models/Token.js";
import crypto from "crypto";
import { sendEmail } from "../SendEmail.js";
import mongoose from "mongoose";
import { deleteFileFromCloudinary, uploadImageToCloudinary } from "../helpers/functions.js";

export const signin = async (req, res) => {

  try {
    const { email, password } = req.body;
    const userData = await User.aggregate([
      {
        $match: { email: email }, // Find the user by email
      },
      {
        $lookup: {
          from: "orderitems", // Name of the collection you're joining (OrderItem collection)
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $eq: ["$isPlaced", false] } // Only include items where isPlaced is false
                  ],
                },
              },
            },
          ],
          as: "carts", // The name of the field in the result
        },
      },
      {
        $lookup: {
          from: "wishlistitems", // Name of the collection you're joining
          localField: "_id",
          foreignField: "user",
          as: "whislistItems",
        },
      },
    ]);
    const oldUser = userData?.[0]
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id,role: oldUser.role},
      process.env.JWTSECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const uploadProfileImage = async (req, res) => {
 

  try {
    const { type, image } = req.body;
    const { id } = req.params;
    const OldUser = await User.findOne({ _id: id });
    let oldFile, imageToSet, tempImage;
    if (type === "cover") {
      oldFile = OldUser.coverImage;
    } else {
      oldFile = OldUser.profileImage;
    }
    if(oldFile){
      const isDeleted = await deleteFileFromCloudinary(oldFile)
      if (isDeleted) {
        const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
        tempImage = fileFromCloudinary?.url;
      }else{
        res.status(500).json({ message: "Something went wrong while deleting previous image" });
      }
    }else{
      const fileFromCloudinary = await uploadImageToCloudinary(req.file, res)
      tempImage = fileFromCloudinary?.url;
    }
   
    if (type === "cover") {
      imageToSet = { coverImage: tempImage };
    } else {
      imageToSet = { profileImage: tempImage };
    }
    const newUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: imageToSet },
      { new: true }
    );

    res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const signup = async (req, res) => {
 
  try {
    const data = { ...req.body };
    let fullName = `${data.firstName} ${data.lastName}`;
    delete data.firstName;
    delete data.lastName;
    const oldUser = await User.findOne({ email: data.email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const result = await User.create({
      ...data,
      password: hashedPassword,
      fullName: fullName,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id, role: result.role },
      process.env.JWTSECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({ result, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const googleSignIn = async (req, res) => {
 

  try {
    const { email, name, token, googleId } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name };
      return res.status(200).json({ result, token });
    }

    const result = await User.create({
      email,
      fullName: name,
      googleId,
    });

    res.status(200).json({ result, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(user.id) },
      },
      {
        $lookup: {
          from: "orderitems", // Name of the collection you're joining (OrderItem collection)
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $eq: ["$isPlaced", false] } // Only include items where isPlaced is false
                  ],
                },
              },
            },
          ],
          as: "carts",
        },
      },
      {
        $lookup: {
          from: "wishlistitems", // Name of the collection you're joining
          localField: "_id",
          foreignField: "user",
          as: "whislistItems",
        },
      },
      {
        $project: {
          password: 0, // Exclude the password field
        },
      },
    ]);

    res.status(200).json(userData[0] || {}); // Send the first (and likely only) result back
  } catch (error) {
    return res.status(500).json(error);

  }
};
// export const getUser = async (req, res) => {
//   const user = req.user;
//   const userData = await User.findById(user.id, { password: 0 })
//     .populate("carts")
//     .populate("whislistItems");
//   res.status(200).json(userData);
// };
export const getUsers = async (req, res) => {
 try {
   const users = await User.find({});
   res.status(200).json(users);
 } catch (error) {
   return res.status(500).json(error);
 }
};

export const resetPasswordRequestController = async (req, res) => {
 try {
   const user = await User.findOne({ email: req.body.email });
   if (!user) res.status(404).json({ message: "Email does not exist" });

   let token = await Token.findOne({ userId: user._id });
   if (token) {
     await token.deleteOne();
   }

   let resetToken = crypto.randomBytes(32).toString("hex");
   const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

   await new Token({
     userId: user._id,
     token: hash,
     createdAt: Date.now(),
   }).save();

   const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;

   sendEmail(
     user.email,
     "Password Reset Request",
     {
       name: user.fullName,
       link: link,
     },
     "/views/template/requestResetPassword.ejs"
   );
   return res.json({ link });
 } catch (error) {
   return res.status(500).json(error);
 }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { userId, token, password } = req.body;

    let passwordResetToken = await Token.findOne({ userId });

    if (!passwordResetToken) {
      res
        .status(404)
        .json({ message: "Invalid or expired password reset token first one" });
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      res
        .status(404)
        .json({ message: "Invalid or expired password reset token" });
    }

    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    const user = await User.findById({ _id: userId });

    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.fullName,
      },
      "/views/template/resetPassword.ejs"
    );

    await passwordResetToken.deleteOne();

    return res.json({ message: "Password reset was successful" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
