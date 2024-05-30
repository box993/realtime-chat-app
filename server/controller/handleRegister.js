import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a strong secret key

const handleRegister = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      password: hashedPassword,
      status: 'AVAILABLE',
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully.', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
};

export default handleRegister;
