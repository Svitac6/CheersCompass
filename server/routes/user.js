import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken'

router.post('/signup', async (req,res) =>{
    const {username, email, password} = req.body;
    const user = await User.findOne({email})
    if(user){
       return req.json({message: "user already existed"})
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,
    })

    await newUser.save()
    return res.json({status: true, amessage: "record registed" })

} )

router.post('/login',async  (req,res)=> {
    const {email,password} =  req.body;
    const user = await User.findOne({email})
    if(!user) {
        return res.json({message:"user is not registered"})
    }

    const validPassword = await bcrypt.compare(password,user.password)
    if(!validPassword){
        return rs.json({message : "password is incorrect"})
    }

    const token = jwt.sign({username:user.username}, process.env.KEY,{expiresIn:'1h'})
    res.cookie('token', token,{httpOnly:true,maxAge:360000})
    return res.json({status:true,message:"login sucessfully"})
})

export {router as UserRouter}