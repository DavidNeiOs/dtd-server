import {  body, validationResult } from 'express-validator'
import { RequestHandler } from "express";
import * as bcrypt from 'bcryptjs'
import * as jwt from "jsonwebtoken"

import User from "../models/User"

export const validateLogIn = [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  body('password').not().isEmpty()
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
      id: user.id,
      name: user.name,
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