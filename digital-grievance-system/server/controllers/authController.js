const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_grievance_redressal_system_2026',
    { expiresIn: '7d' }
  );
};

const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || name.trim() === '') return res.status(400).json({ success: false, message: 'Full name is required' });
    if (!email || !EMAIL_REGEX.test(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (!phone || !PHONE_REGEX.test(phone)) return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 numeric digits' });

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
    if (!password || !passRegex.test(password)) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters, with 1 uppercase and 1 special character (!@#$&*)' });

    const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ success: false, message: 'An account with this email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), phone: phone.trim(), password: hashedPassword, role: assignedRole });

    const token = generateToken(user._id, user.role);

    res.status(201).json({ success: true, message: 'Account created successfully', token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !EMAIL_REGEX.test(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id, user.role);

    res.status(200).json({ success: true, message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone, role: req.user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'There is no user with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'https://digital-grievance-system.vercel.app';
    const resetUrl = \`\${frontendUrl}/reset-password/\${resetToken}\`;

    const message = \`You are receiving this email because you requested a password reset. Please make a PUT request to: \n\n \${resetUrl}\`;
    const htmlMessage = \`<h3>Password Reset Request</h3><p>You requested a password reset. Click the link below to set a new password:</p><a href="\${resetUrl}" target="_blank">Reset Password</a><br><br><p>If you did not request this, please ignore this email.</p>\`;

    try {
      await sendEmail({ email: user.email, subject: 'Password reset token', message, html: htmlMessage });
      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const { password } = req.body;
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
    if (!password || !passRegex.test(password)) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters, with 1 uppercase and 1 special character (!@#$&*)' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, message: 'Password updated successfully', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { signup, login, getMe, forgotPassword, resetPassword };
