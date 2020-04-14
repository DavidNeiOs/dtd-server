import { RequestHandler } from "express"
import {  body, validationResult } from 'express-validator'
import * as bcrypt from 'bcryptjs'
import * as jwt from "jsonwebtoken"

import User, { UserDoc } from "../models/User"

export const validateRegister = [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  body('name').trim().not().isEmpty(),
  body('password').not().isEmpty()
]

export const register: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json(errors.array())
  }
  const user = await User.findOne({ email: req.body.email })
  if(user) {
    return res.status(400).json({ success: false, message: "Email already exists"})
  }

  const { name, email, password } = req.body;

  const newUser = new User({
    name, email, password
  })

  // hash of password
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(newUser.password, salt)
  newUser.salt = salt;
  newUser.password = hash;
  const userDb = await newUser.save()

  // sign in directly

  const payload = {
    id: userDb._id,
    name: userDb.name,
    email: userDb.email,
    gravatar: userDb.gravatar
  }

  const secret = process.env.SECRET || 'mySecret'

  jwt.sign(
    payload,
    secret,
    {
      expiresIn: 31556926
    },
    (err, token) => {
      res.json({
        success: true,
        token: `Bearer ${token}`
      })
    }
  )
}

export const updateUser: RequestHandler = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findOneAndUpdate(
    // haven't a proper solutin to this error
    //@ts-ignore
    { _id: req.user?._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  )

  // update token with new info
  const payload = {
    id: user?._id,
    name: user?.name,
    email: user?.email,
    gravatar: user?.gravatar
  }

  const secret = process.env.SECRET || 'mySecret'

  jwt.sign(
    payload,
    secret,
    {
      expiresIn: 31556926
    },
    (err, token) => {
      res.json({
        success: true,
        token: `Bearer ${token}`,
      })
    }
  )
} 