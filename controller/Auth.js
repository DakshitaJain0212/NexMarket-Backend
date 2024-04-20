const { User } = require("../model/user");
const crypto = require("crypto");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { sendMail } = require("../services/common");

// exports.createUser = async (req, res) => {
//   try {
//     const checkemail = await User.findOne({ email: req.body.email });
//     console.log(checkemail);
//     if (checkemail != null) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already exist try by another email",
//         data: [],
//       });
//     }

//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPassword = await bcrypt.hash(req.body.password.toString(), salt);
//     // console.log(hashedPassword.toString());
//     const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
    
//     req.body.password = hashedPassword;
//     console.log(req.body.password );
//     const user = new User(req.body);
//     const userSave = await user.save();
//     const userInsertId = userSave._id;

//     const userInfo = await User.findOne(
//       { _id: userInsertId },
//       "password role name  email "
//     );
//     console.log("user Details ===>>", userInfo);

//     const token = jwt.sign({ id: userInfo._id }, SECRET_KEY, {
//       expiresIn: "3d",
//     });

//     let tempObj = {
//       _id: userInfo._id,
//       email: userInfo.email,
//       password: userInfo.password,
//       name: userInfo.name,
//       token: token,
//     };
//     return res.status(200).json({
//       success: true,
//       message: "registration_successfully",
//       data: tempObj,
//     });
//   } catch (err) {
//     return res.status(461).json({
//       success: false,
//       message: err.message,
//       data: [],
//     });
//   }
// };


// exports.loginUser =async(req,res)=>{
//   try{

//       const userDetails = await User.findOne(
//     { email: req.body.email },
//     "password  name  email "
//   );

//   console.log(userDetails.password);

//   const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

//   // console.log("hash",hashedPassword);

//   // console.log("user",userDetails.password)
//   if (hashedPassword !== userDetails.password) {
//     return res.status(401).json({ error: 'Invalid password.' });
//   }

//       if (userDetails) {
//           const token = jwt.sign(
//             { id: userDetails._id },
//             SECRET_KEY,
//             {
//               expiresIn: '3d',
//             }
//           );
    
        
//           let tempObj = {
//             _id: userDetails._id,
//             email: userDetails.email,
           
//             name: userDetails.name,
//             token: token,
//           };
    
//           return res.status(200).json({
//               success:true,
//               message:"login successfully",
//               data:tempObj

//           }
//           );
      
//       }else{
//           return res.status(404).json({
//               success:false,
//               message:"Email not found user don't exist",
//               data:[]
//           })
//       }}catch(err){
//         return res.status(461).json({
//           success:false,
//           message:err.message,
//           data:[]
//         })
//       }}

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).json({
        sucess: false,
        message: "Email already exist!",
      });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const doc = await newUser.save();

    const userId = doc._id;

    const userInfo = await User.findOne(
      { _id: userId },
      "password role name email"
    );

    const token = jwt.sign({ id: userInfo._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    let tempObj = {
      id: userInfo._id,
      email: userInfo.email,
      name: userInfo.name,
      token: token,
    };
    res.status(200).json(tempObj);
  } catch (err) {
    res.status(500).json(err);
    console.log("Err");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }, "password name email");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    console.log(user.email);
    console.log("req", password);
    console.log("user", user.password);
    const passwordMatch = crypto.createHash('sha256').update(password).digest('hex');
    if (passwordMatch !== user.password) {
      return res.status(401).json({ error: "Invalid password." });
      
    } else {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      const userData = {
        id: user._id,
        email: user.email,
        token: token,
      };

      const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000),
        httpOnly: true
      }

      return res.status(200).cookie("token", token, options).json(userData);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.checkAuth = async (req, res) => {
  const user = req.body;
  console.log(user)
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(401);
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();

    // Also set token in email
    const resetPageLink =
      '/reset-password?token=' + token + '&email=' + email;
    const subject = 'reset password for e-commerce';
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;


    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};


exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  // Validate the presence of email, password, and token
  if (!email || !password || !token) {
    return res.status(400).json({ error: 'Email, password, and token are required' });
  }

  try {
    // Find the user by email and reset token
    const user = await User.findOne({ email, resetPasswordToken: token });

    // If user found
    if (user) {
      // Hash the new password
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      // Update the user's password
      user.password = hashedPassword;

      // Clear the reset password token
      user.resetPasswordToken = undefined;

      // Save the updated user
      await user.save();

      // Send email notification about password reset
      const subject = 'Password successfully reset for e-commerce';
      const html = '<p>Your password has been successfully reset.</p>';
      await sendMail({ to: email, subject, html });

      // Return success response
      return res.status(200).json({ message: 'Password successfully reset' });
    } else {
      // If user not found, return error response
      return res.status(400).json({ error: 'Invalid email or token' });
    }
  } catch (error) {
    // Handle any errors
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};