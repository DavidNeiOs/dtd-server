import { RequestHandler } from "express"
import {  body, validationResult } from 'express-validator'
import mongoose from "mongoose"

export const validateRegister = [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  body('name').trim().not().isEmpty(),
  body('password').not().isEmpty()
]

export const register: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).jsonp(errors.array())
  } else {
    res.send(req.body)
  }
}