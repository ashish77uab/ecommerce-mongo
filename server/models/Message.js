import mongoose from "mongoose";

export const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  read: { // New field for tracking read status
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
