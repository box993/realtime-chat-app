import userModel from '../models/user.js';

const handleStatus = async (req, res) => {
  const userId = req.userId;
  const user = await userModel.findOne({ _id: userId });
  console.log(user.status);
  const userDoc = await userModel.findOneAndUpdate(
    { _id: userId },
    {
      status: user.status === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE',
    },
    { new: true }
  );

  res.json({ status: userDoc.status });
};

export default handleStatus;
