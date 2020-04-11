import express from "express"

import { upload } from "../services/multer"
import { resize } from "../services/jimp"

import { addMedia } from "../controllers/helpersController"
import { getStores, createStore, editStore, updateStore, getStoreBySlug, getStoresByTag } from "../controllers/storeController"
import { validateRegister, register } from "../controllers/userController"
import { login, validateLogIn, isLoggedIn } from '../controllers/authController'
import { catchErrors } from "../handlers/errorHandlers"


const router = express.Router()

router.get('/', catchErrors(getStores))

router.post('/upload-image', isLoggedIn, upload.single('image'), catchErrors(resize), addMedia)

router.post('/add', isLoggedIn, catchErrors(createStore))

router.get('/stores/:id/edit', isLoggedIn, catchErrors(editStore))

router.post('/stores/:id/edit', isLoggedIn, catchErrors(updateStore))

router.get('/store/:slug', catchErrors(getStoreBySlug))

router.get('/tags', catchErrors(getStoresByTag))

router.get('/tags/:tag', catchErrors(getStoresByTag))

router.post('/register', validateRegister, catchErrors(register))

router.post('/login', validateLogIn, catchErrors(login))


export { router };