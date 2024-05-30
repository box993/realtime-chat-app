import messageModel from '../models/message.js';

const getMoreMessagesController = async (req, res) => {
  const { chatId, skip } = req.body;

  const latestMessages = await messageModel
    .find({ chatId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(10);
  console.log(skip);
  latestMessages.reverse();

  res.json({ messages: latestMessages });
};

export default getMoreMessagesController;
