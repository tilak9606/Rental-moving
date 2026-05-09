import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, city } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, phone, role: role || 'tenant', city });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  }  catch (error) {
    next(error); 
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      token: generateToken(user._id)
    });
  }  catch (error) {
    next(error); 
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  }  catch (error) {
    next(error); 
  }
};

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import { asyncHandler } from '../utils/asyncHandler.js';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// export const register = asyncHandler(async (req, res) => {
//   const { name, email, password, phone, role, city } = req.body;

//   if (!name || !email || !password) {
//     res.status(400);
//     throw new Error('Please provide name, email and password');
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error('User already exists');
//   }

//   const user = await User.create({
//     name, email, password, phone,
//     role: role || 'tenant', city
//   });

//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token: generateToken(user._id)
//   });
// });

// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     res.status(401);
//     throw new Error('Invalid credentials');
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     res.status(401);
//     throw new Error('Invalid credentials');
//   }

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     phone: user.phone,
//     city: user.city,
//     token: generateToken(user._id)
//   });
// });

// export const getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.json(user);
// });