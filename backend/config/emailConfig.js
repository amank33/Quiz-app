import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Admin Gmail ID
    pass: process.env.EMAIL_PASS, // Admin Gmail Password
  },
});

export default transporter;

//mail send code
// if (savedUser) {
//     console.log('sending mail')
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: savedUser.email,
//       subject: "Please use the link provided to login to your account",
//       html: `<p>Dear ${savedUser.username},</p><p>Please use the link provide below to login to your account by entering your credentials as listed below.</p>
      
//       <p> Username: ${savedUser.username}</p><p> Password: ${password}</p>
//       <p> your role is ${savedUser.role}</p>
//       <a href='localhost:4009/user/login'>Login page link</a>
//       `
//     })