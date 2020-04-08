import { RequestHandler } from "express";
import jimp from "jimp"
import { v4 as uuidv4 } from "uuid"

export const resize: RequestHandler = async (req, res, next) => {
  // check if there's no file to resize
  if(!req.file) {
    next(); // skip to next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `${uuidv4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);

  await photo.write(`./public/images/${req.body.image}`);

  // once we have written the file to our filesystem, keep going!
  next();
}