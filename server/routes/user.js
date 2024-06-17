import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        // Hachage du mot de passe
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashpassword,
            isVerified: false // Ajouter un champ pour vérifier si l'utilisateur est vérifié
        });

        // Sauvegarder le nouvel utilisateur dans la base de données
        const savedUser = await newUser.save();

        // Générer un token JWT
        const token = jwt.sign(
            { id: savedUser._id, username: savedUser.username },
            process.env.KEY,
            { expiresIn: '1d' }
        );

        // Configurer le transporteur d'email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Définir les options de l'email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: http://localhost:5173/verifyEmail/${token}`
        };

        // Envoyer l'email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                return res.json({ message: "Error sending email" });
            } else {
                console.log('Email sent:', info.response);
                return res.json({ status: true, message: "Verification email sent" });
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.json({ message: "Signup failed" });
    }
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
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
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
router.get('/isAdmin', verifyUser, async (req, res) => {
    try {
        const { id } = req.user; // Extract user ID from decoded token
        const user = await User.findById(id);
        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }
        const { isAdmin } = user;
        return res.json({ status: true, data: { isAdmin } });
    } catch (err) {
        return res.json({ status: false, message: "Error fetching user data" });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.json({ status: false, message: "No users found" });
        }
        const usersData = users.map(user => {
            const { _id, username, email, isVerified, isAdmin } = user;
            return { _id, username, email, isVerified, isAdmin };
        });
        return res.json({ status: true, data: usersData });
    } catch (err) {
        return res.json({ status: false, message: "Error fetching users data" });
    }
});

//dangerous function for haters
router.delete('/deleteUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }
        await User.findByIdAndDelete(userId);
        return res.json({ status: true, message: "User deleted successfully" });
    } catch (err) {
        return res.json({ status: false, message: "Error deleting user" });
    }
});


export { router as UserRouter };
