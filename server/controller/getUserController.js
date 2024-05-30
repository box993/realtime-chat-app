import userModel from '../models/user.js';

const getUserController = async (req, res) => {
  const userDoc = await userModel.findOne({ _id: req.userId });
  res.json({
    username: userDoc.email,
    status: userDoc.status,
    userId: req.userId,
  });
};

export default getUserController;
