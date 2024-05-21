import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'


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
    const token = jwt.sign({ id: savedUser._id }, process.env.KEY, { expiresIn: '1d' });

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

    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
    return res.json({ status: true, message: "Login successfully" });
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "user not registered" })
        }
        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cheerscompass51@gmail.com',
                pass: 'nyszysqfaofozqzv'
            }
        });

        var mailOptions = {
            from: 'cheerscompass51@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ message: "error sending sent" });
            } else {
                return res.json({ status: true, message: "email sent" });
            }
        });


    } catch (err) {
        console.log(err)
    }

})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({ _id: id }, { password: hashpassword })
        return res.json({ status: true, message: "updated password " })
    } catch (err) {
        return res.json("invalid token")
    }
})

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: "no token" })
        }
        const decoded= await jwt.verify(token, process.env.KEY)
        next()
    } catch (err) {
        return res.json(err)
    }
}


router.get('/verify', verifyUser,(req, res) => {
    return res.json({status:true,message:"authorized"})
});

router.get('/logout', (req,res)=>{
    res.clearCookie('token')
    return res.json({status: true})
})


export { router as UserRouter }