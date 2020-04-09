import express from "express"

import { upload } from "../services/multer"
import { resize } from "../services/jimp"

import { addMedia } from "../controllers/helpersController"
import { getStores, createStore, editStore, updateStore, getStoreBySlug } from "../controllers/storeController"
import { catchErrors } from "../handlers/errorHandlers"


const router = express.Router()

router.get('/', catchErrors(getStores))

router.post('/upload-image', upload.single('image'), catchErrors(resize), addMedia)

router.post('/add', catchErrors(createStore))

router.get('/stores/:id/edit', catchErrors(editStore))

router.post('/stores/:id/edit', catchErrors(updateStore))

router.get('/store/:slug', catchErrors(getStoreBySlug))

export { router };