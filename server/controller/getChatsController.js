import chatModel from '../models/chat.js';

const getChatsController = async (req, res) => {
  try {
    // Find all chats where the user is a member
    const chats = await chatModel
      .find({ members: { $in: [req.userId] } })
      .populate('members', 'email')
      .exec();

    const response = chats.map((chat) => {
      const membersEmails = chat.members
        .filter((member) => member._id.toString() !== req.userId.toString())
        .map((member) => member.email);

      return {
        _id: chat._id,
        name: membersEmails,
        time: chat.latestMessage,
      };
    });

    response.sort((a, b) => b.time - a.time); // Sort in descending order based on time

    res.json({ chats: response });
  } catch (error) {
    console.error('Error in getChatsController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getChatsController;
