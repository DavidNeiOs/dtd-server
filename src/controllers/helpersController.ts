import {RequestHandler} from "express";

export const addMedia: RequestHandler = (req, res) => {
  const file = req.file
  if(!file) {
    res.send({ success: false, error_code: "no_file"})
    return;
  }
  console.log('Uploaded file', file)
  const url = `/images/${file.filename}`

  res.send({ success: true, url })
}