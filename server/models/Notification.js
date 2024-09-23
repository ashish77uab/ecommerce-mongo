import mongoose from "mongoose";
import { VoucherConstant } from "../utils/constant.js";

const notificationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // User who receives the notification

        type: {
            type: String,
            enum: [VoucherConstant.Order, VoucherConstant?.Promotion, VoucherConstant?.System, VoucherConstant?.Voucher],
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        }, 

    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
