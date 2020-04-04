import express from "express"

import { upload } from "../services/multer"

import { addMedia } from "../controllers/helpersController"
import { homePage, createStore } from "../controllers/storeController"


const router = express.Router()

router.get('/', homePage)

router.post('/upload-image', upload.single('image'), addMedia)

router.post('/add', createStore)

export { router };