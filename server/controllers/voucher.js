import mongoose from "mongoose";
import Voucher from "../models/Voucher.js";
import ShortUniqueId from 'short-unique-id';
export const getVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.voucherId);
    if (!voucher) {
      return res.status(400).json({ message: 'Voucher could not be found' });
    }
    res.status(200).json(voucher);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllVoucher = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalVouchers = await Voucher.countDocuments();
    const allVouchers = await Voucher.aggregate([     
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip, // Skip the necessary number of documents for pagination
      },
      {
        $limit: limit, // Limit the results to the page size
      }

    ]);
    res.status(200).json({
      vouchers: allVouchers,
      currentPage: page,
      totalPages: Math.ceil(totalVouchers / limit),
      totalVouchers
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const createVoucher = async (req, res) => {
  try {
    const { randomUUID } = new ShortUniqueId({ length: 8 });
    const voucher = await Voucher.create({ ...req.body, code: String(randomUUID()).toUpperCase() });
    if(!voucher){
      return res.status(400).json({ message: 'Voucher could not created' });
    }
    res.status(201).json(voucher);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.voucherId, { ...req.body }, {new:true});
    if(!voucher){
      return res.status(400).json({ message: 'Voucher could not updated' });
    }
    res.status(200).json(voucher);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkVoucherCode = async (req, res) => {
  try {
    const code = req.body.voucherCode;
    const totalPrice = req.body.totalPrice;
    const userId = req.user?.id;
    const voucher = await Voucher.findOne({
      code: code,
      user: { $in: [mongoose.Types.ObjectId(userId)] } // Check if userId is in the user array
    });
    if(!voucher){
      return res.status(400).json({ message: 'Not Valid Voucher' });
    }
    
    if(voucher.expirationDate < new Date()){
      return res.status(400).json({ message: 'Voucher has expired' });
    }
    if (voucher.usageLimit <1) {
      return res.status(400).json({ message: 'Voucher is used' });
    }
    const discountedValue = totalPrice * voucher?.discountValue / 100
    const isDiscounted = discountedValue < voucher?.maxDiscountValue
    
    if (isDiscounted){
      res.status(200).json({
        discountValue: discountedValue,
        voucherId: voucher?._id
});
    }else{
      res.status(200).json({
        discountValue: voucher?.maxDiscountValue,
        voucherId: voucher?._id
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.voucherId);
    if(!voucher){
      return res.status(400).json({ message: 'Voucher could not deleted' });
    }
    res.status(200).json(voucher);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
