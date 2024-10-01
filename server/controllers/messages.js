
import Message from "../models/Message.js";

export const getAllMessages = async (req, res) => {
  try {
    const { userId, adminId } = req.params; // Extract userId and adminId from the request parameters
    const { page = 1, limit = 1000 } = req.query; // Extract page and limit from query parameters (default: page 1, limit 20)

    const skip = (page - 1) * limit;
    await Message.updateMany({
      $or: [
        { sender: userId, recipient: adminId },
      ]
    },{
      read:true
    })

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: adminId },
        { sender: adminId, recipient: userId }
      ]
    })
      .sort({ createdAt: 1 }) // Sort by most recent messages first
      .skip(skip)
      .limit(parseInt(limit)); // Limit the number of results
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const readMessage = async (req, res) => {
  try {
    const { messageId } = req.params; // Extract userId and adminId from the request parameters
   const updatedMessage=   await Message.findByIdAndUpdate(messageId,{
      $set:{ read:true}
    },{
      new:true
    })
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error while update single message read ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

