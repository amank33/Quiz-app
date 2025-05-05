import User from "../models/user.model.js"
import bryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from "nanoid";
import transporter from "../config/emailConfig.js";
import dotenv from 'dotenv'
dotenv.config()


const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameTaken = await User.exists({
      "username": username,
    }).then((result) => result); // check if username is available
  
    return isUsernameTaken ? username + nanoid().substring(0, 5) : username;
  };
export const Register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body
        let username = await generateUsername(email);
        // check if user not registered
        const checkRegistrationStatus = await User.findOne({ email })
        if (checkRegistrationStatus) {
            return res.status(409).json({
                status: false,
                message: "User already registered"
            })
        }

        // hash password 
        const hashPassword = bryptjs.hashSync(password)
        const newRegistration = new User({
            fullname, email, password: hashPassword,username
        })

        const savedRegistration = await newRegistration.save();

        res.status(200).json({
            status: true,
            message: "Registration success.",
            data: savedRegistration

        })

    } catch (error) {
        res.status(500).json({
            status: false, message:error.message
        })
    }
}
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        // check if user not registered
        const userData = await User.findOne({ email })
        if (!userData) {
            return res.status(403).json({
                status: false,
                message: "Invalid login credentials."
            })
        }

        // check password 
        const isVerifyPassword = await bryptjs.compare(password, userData.password)
        if (!isVerifyPassword) {
            return res.status(403).json({
                status: false,
                message: "Invalid login credentials password."
            })
        }
        // if (!userData) {
        //     return res.status(403).json({
        //         status: false,
        //         message: "Invalid login credentials.",

        //     })
        // }else{
        //     return res.status(403).json({
        //         status: false,
        //         message: "valid login credentials.",
        //         user: userData

        //     })
        // }

        

        delete userData.password

        //const token = jwt.sign(user, process.env.JWT_SECRET)
        const accessToken = jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: '5hr' });


        res.cookie('access_token', accessToken, {
            httpOnly: true
        })
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true
        })
       
        res.status(200).json({
            status: true,
            message: "Login success.",
            user: userData,
            accessToken,
            refreshToken
        })

    } catch (error) {
        res.status(500).json({
            status: false, message:error.message
        })
    }
}

export const sendResetPasswordEmail = async (req, res) => {
    try {
        
        const { email } = req.params;
        
        // check if user not registered
        const userData = await User.findOne({ email })
        if (!userData) {
            return res.status(403).json({
                status: false,
                params:req.body,
                message: "User not registered."
            })
        }

        const password = 'Bitwise@333';//nanoid(8)
        const hashPassword = bryptjs.hashSync(password)
        const savedUser = await User.findByIdAndUpdate(
            userData._id,
            { password: hashPassword },
            { new: true }
        );

        if (userData) {
            //console.log('sending mail')
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: email,
              subject: "Please use the link provided to login to your account with your updated password",
              html: `<p>Dear ${userData.username},</p><p>Please use the link provide below to login to your account by entering your credentials as listed below. Please use this password to login.</p>
              
              <p> Email: ${userData.email}</p>
              <p> Username: ${userData.username}</p>
              <p> Password: ${password}</p>
              <p> your role is ${userData.role}</p>
              <a href='${process.env.CLIENT_URL}/'>Login page link</a>
              `
            })
        }

        res.status(200).json({
            status: true,
            message: "Email sent successfully.",
            data:userData
        })
    
    } catch (error) {
        res.status(500).json({
            status: false, message:error.message
        })
    }
}