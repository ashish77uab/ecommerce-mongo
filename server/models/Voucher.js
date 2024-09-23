import mongoose from "mongoose";

const voucherSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }, 
        code: {
            type: String,
            required: true,
            unique: true
        }, // Unique voucher code
        user: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            },
        ],
        usersUsed: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            },
        ],
        discountValue: {
            type: Number,
            required: true
        }, // Discount value, either percentage or fixed amount
        maxDiscountValue: {
            type: Number,
            required: false
        }, // Maximum discount cap (useful for percentage discounts)
        isActive: {
            type: Boolean,
            default: true
        }, // Whether the voucher is active or not

        isUsed: {
            type: Boolean,
            default: false
        }, // Track if voucher has already been used
        

        expirationDate: {
            type: Date,
            required: true
        }, // Voucher expiration date

        usageLimit: {
            type: Number,
            default: 0
        }, // How many times a voucher can be used
    },
    { timestamps: true }
);

export default mongoose.model("Voucher", voucherSchema);
