import express from "express"
import { upload } from "../services/multer"
import {homePage} from "../controllers/storeController"


const router = express.Router()

router.get('/', homePage)

router.post('/upload-image', upload.single('image'), (req, res) => {
  const file = req.file
  if(!file) {
    res.send({ success: false, error_code: "no_file"})
    return;
  }
  console.log('Uploaded file', file)
  const url = `/images/${file.filename}`

  res.send({ success: true, url })
})

export { router };