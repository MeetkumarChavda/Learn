import bcryptjs from 'bcryptjs'
import { User } from "../models/user.model.js";
import { genrateTokenAndSetCookie } from '../utils/genrateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/email.js';

export const signup = async (req, res) =>{
   const { name , email , password } = req.body;

   try {
    if(!name || !email || !password){
        throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });

    if(userAlreadyExists){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }

    const hashedPassowrd = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random()* 900000).toString();

    const user = new User({
        email,
        name,
        password:hashedPassowrd,
        verificationToken,
        verificationExpiresAt:Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    //JWT
    genrateTokenAndSetCookie(res, user._id);
    
    //Send verification email
    await sendVerificationEmail(user.email,verificationToken);

    res.status(201).json({
        success:true,
        message: "User created successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });

    
   } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
    
   }

}
export const login = async (req, res) =>{
    res.send("Login route")
}
export const logout = async (req, res) =>{
    res.send("Logout route")
}