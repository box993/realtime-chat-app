import messageModel from '../models/message.js';
import chatModel from '../models/chat.js';

const handleMessage = async (message, chatId, senderId) => {
  try {
    const newMessage = new messageModel({
      chatId,
      content: message,
      sender: senderId,
      timestamp: Date.now(),
    });

    const savedMessage = await newMessage.save();

    console.log('Message saved:', savedMessage);
    const chatDoc = await chatModel.findOne({
      _id: chatId,
    });

    return {
      members: chatDoc.members,
      messageObj: savedMessage,
    };
  } catch (error) {
    console.error('Error saving message:', error);
    throw error; // Ensure to propagate the error for proper error handling
  }
};

export default handleMessage;
