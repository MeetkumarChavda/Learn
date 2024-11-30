import bcryptjs from 'bcryptjs'
import crypto from 'crypto';
import { User } from "../models/user.model.js";
import { genrateTokenAndSetCookie } from '../utils/genrateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../mailtrap/email.js';


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
    });
   }

}
export const login = async (req, res) =>{
    const { email , password } = req.body;

    try {
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email! This email doesn't exists"
            });
        }

        const isValidpwd = await bcryptjs.compare(password , user.password);
        if(!isValidpwd){
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }
        
        genrateTokenAndSetCookie(res , user._id);

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Logged in successfully",
            user:{
                ...user._doc,
                password:undefined
            },
        });

    } catch (error) {
        console.log("Error in login", error);
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}
export const logout = async (req, res) =>{
    res.clearCookie("token");
    res.status(200).json({ 
        success:true,
        message: "Logged out successfully" 
    });
}

export const verifyEmail = async (req, res) =>{
    const{ code } = req.body;
    try {
        const user = await User.findOne({   
                verificationToken:code,
                verificationExpiresAt:{$gt: Date.now()},
            });

        if(!user){
            return res.status(400).json({
                success:false,
                message: "Invalid verification code"
            })
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        
        res.status(200).json({
            success:true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log('error in' , error);
        res.status(500).json({
            success:false,
            message: "Server Error"
        })
    }
}

export const forgotPassword = async (req, res) =>{
    const { email } = req.body;

    try {
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Does not exists"
            })
        }

        // Genrate resetToken
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;//1hour

        user.resetPassowrdToken = resetToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success:true,
            message:"Passowrd reset link send to your email"
        })

    } catch (error) {
        console.log("Error in forgotPassword" , error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}