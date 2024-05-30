import userModel from '../models/user.js';
import chatModel from '../models/chat.js';

const handleSearchController = async (req, res) => {
  try {
    const search = req.query.search;
    const user = await userModel.findOne({ email: search });
    console.log(user);
    if (!user) {
      return res.json({});
    }

    let chat = await chatModel.findOne({
      members: { $all: [req.userId, user._id] },
    });

    // If a chat already exists, return an empty object

    if (chat) {
      return res.json({});
    }

    // Create a new chat if it doesn't exist
    chat = new chatModel({
      members: [req.userId, user._id],
    });
    await chat.save();
    await chat.populate('members', 'email');

    console.log(chat);

    const membersEmails = chat.members
      .filter((member) => member._id.toString() !== req.userId.toString())
      .map((member) => member.email);

    const chatData = {
      id: chat._id,
      name: membersEmails[0], // Assuming there is only one other member
      time: chat.latestMessage,
    };

    console.log(chatData);

    res.json({ chat: chatData });
  } catch (error) {
    console.error('Error in handleSearchController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handleSearchController;
