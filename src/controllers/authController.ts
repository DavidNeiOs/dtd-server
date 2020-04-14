import {  check, body, validationResult } from 'express-validator'
import { RequestHandler } from "express";
import crypto from "crypto"
import * as bcrypt from 'bcryptjs'
import * as jwt from "jsonwebtoken"

import User from "../models/User"
import { hashPassword } from '../utils';

export const validateLogIn = [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  body('password').not().isEmpty()
]

export const validateResetPassword = [
  check("password", "invalid password")
    .isLength({ min: 4 })
    .custom((value, {req}) => {
      if (value !== req.body.password_confirm) {
          // trow error if passwords do not match
          throw new Error("Passwords don't match");
      } else {
          return value;
      }
    })
]

export const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json(errors.array())
  }

  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  const user = await User.findOne({ email })
  // Check if user exists
  if (!user) {
    return res.status(404).json({ succes: false, message: "Email not found" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password)
  if (isMatch) {
    // User matched
    // Create JWT Payload
    const payload = {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      gravatar: user.gravatar
    };
    const secret = process.env.SECRET || 'mySecret'
    // Sign token
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: 31556926 // 1 year in seconds
      },
      (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }
    );
  } else {
    return res.status(406).json({ success: false, message: "Passwords dont match" });
  }
}

export const forgotPassword: RequestHandler = async (req, res) => {
  // 1. See if the user exists
  const user = await User.findOne({ email: req.body.email })
  if(!user) {
    return res.status(400).json({ success: false, message: "No account with that email exists"});
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  // 3. Send an email with the token
  const resetUrl = `/account/reset/${user.resetPasswordToken}`
  // 4. redirect to login page
  res.json({ success: true, message: `You have been emailed a password link.`, resetUrl })
}

export const resetPassword: RequestHandler = async (req, res) => {
  const { salt, hash} = await hashPassword(req.body.password)

  const user = await User.findOneAndUpdate({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    { salt, password: hash, resetPasswordExpires: undefined, resetPasswordToken: undefined},
    { new: true, runValidators: true}).exec();

  if(!user) {
    throw new Error('Password reset is invalid or has expired')
  }

  res.status(200).json({ success: true, message: 'Your password has been updated' })
}