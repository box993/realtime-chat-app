import messageModel from '../models/message.js';
const getChatMessagesController = async (req, res) => {
  const { chatId } = req.query;
  console.log('CHAT ID: ', chatId);

  const latestMessages = await messageModel
    .find({ chatId })
    .sort({ timestamp: -1 })
    .limit(10);
  latestMessages.reverse();

  res.json({ messages: latestMessages });
};

export default getChatMessagesController;
