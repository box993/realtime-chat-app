import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with the same secret key used for signing tokens

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Convert the userId to a MongoDB ObjectId
    const _id = new mongoose.Types.ObjectId(userId);

    // Attach the userId to the request object
    req.userId = _id;
    console.log(req.userId);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Authorization token has expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }

    res.status(500).json({ message: 'Error authenticating user' });
  }
};

export default isAuthenticated;
