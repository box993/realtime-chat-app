import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
  ],
  latestMessage: {
    type: Date,
    ref: 'messages', // Assuming you have a User model
    default: new Date(),
  },
});

const chatModel = mongoose.model('chat', chatSchema);
export default chatModel;
