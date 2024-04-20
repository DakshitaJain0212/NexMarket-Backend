const express = require("express");
const { createUser,loginUser, checkAuth,resetPasswordRequest, resetPassword } = require("../controller/Auth");
const passport = require("passport");

const router = express.Router();

router.post("/signup", createUser)
      .post("/login", loginUser)
      .get("/check", checkAuth)
      .post('/reset-password-request', resetPasswordRequest)
      .post('/reset-password', resetPassword)
      
exports.router = router;
