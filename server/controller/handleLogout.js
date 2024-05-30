import userModel from '../models/user.js';

const handleLogout = async (req, res) => {
  const userDoc = await userModel.findOneAndUpdate(
    { _id: req.userId },
    { status: 'BUSY' }
  );
  res.json({ username: userDoc.email, status: userDoc.status });
};

export default handleLogout;
