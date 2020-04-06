import express from "express"

import { upload } from "../services/multer"

import { addMedia } from "../controllers/helpersController"
import { getStores, createStore } from "../controllers/storeController"
import { catchErrors } from "../handlers/errorHandlers"


const router = express.Router()

router.get('/', catchErrors(getStores))

router.post('/upload-image', upload.single('image'), addMedia)

router.post('/add', catchErrors(createStore))

export { router };