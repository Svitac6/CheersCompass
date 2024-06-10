import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashpassword,
        isVerified: false // Add a field to check if the user is verified
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id, username: savedUser.username }, process.env.KEY, { expiresIn: '1d' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cheerscompass51@gmail.com',
            pass: 'nyszysqfaofozqzv'
        }
    });

    const mailOptions = {
        from: 'cheerscompass51@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: http://localhost:5173/verifyEmail/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.json({ message: "Error sending email" });
        } else {
            return res.json({ status: true, message: "Verification email sent" });
        }
    });
});

router.post('/verify-email/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.json({ message: "User not found" });
        }
        user.isVerified = true;
        await user.save();
        return res.json({ status: true, message: "Email verified successfully" });
    } catch (err) {
        return res.json({ message: "Invalid or expired token" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User is not registered" });
    }

    if (!user.isVerified) {
        return res.json({ message: "Email is not verified" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
    return res.json({ status: true, message: "Login successfully" });
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User not registered" });
        }
        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cheerscompass51@gmail.com',
                pass: 'nyszysqfaofozqzv'
            }
        });

        const mailOptions = {
            from: 'cheerscompass51@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ message: "Error sending email" });
            } else {
                return res.json({ status: true, message: "Email sent" });
            }
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashpassword });
        return res.json({ status: true, message: "Updated password" });
    } catch (err) {
        return res.json({ message: "Invalid token" });
    }
});

const verifyUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded; // Attach decoded token data to req
        next();
    } catch (err) {
        return res.json({ status: false, message: "Invalid token" });
    }
};

router.get('/verify', verifyUser, (req, res) => {
    return res.json({ status: true, message: "Authorized" });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true });
});

router.get('/profile', verifyUser, async (req, res) => {
    try {
        const { id } = req.user; // Extract user ID from decoded token
        const user = await User.findById(id);
        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }
        const { username, email } = user;
        return res.json({ status: true, data: { username, email } });
    } catch (err) {
        return res.json({ status: false, message: "Error fetching user data" });
    }
});

export { router as UserRouter };
