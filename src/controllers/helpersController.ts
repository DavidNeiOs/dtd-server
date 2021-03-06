import {RequestHandler} from "express";

export const addMedia: RequestHandler = (req, res) => {
  const file = req.file
  if(!file) {
    res.send({ success: false, error_code: "no_file"})
    return;
  }
  
  const url = `/images/${req.body.image}`

  res.send({ success: true, url })
}