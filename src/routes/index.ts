import express from "express"
import passport from "passport"

import { upload } from "../services/multer"
import { resize } from "../services/jimp"

import { addMedia } from "../controllers/helpersController"
import { getStores, createStore, editStore, updateStore, getStoreBySlug, getStoresByTag } from "../controllers/storeController"
import { validateRegister, register } from "../controllers/userController"
import { login, validateLogIn } from '../controllers/authController'
import { catchErrors } from "../handlers/errorHandlers"


const router = express.Router()

router.get('/', catchErrors(getStores))

router.post('/upload-image', passport.authenticate('jwt', { session: false }), upload.single('image'), catchErrors(resize), addMedia)

router.post('/add', passport.authenticate('jwt', { session: false }), catchErrors(createStore))

router.get('/stores/:id/edit', passport.authenticate('jwt', { session: false }), catchErrors(editStore))

router.post('/stores/:id/edit', passport.authenticate('jwt', { session: false }), catchErrors(updateStore))

router.get('/store/:slug', catchErrors(getStoreBySlug))

router.get('/tags', catchErrors(getStoresByTag))

router.get('/tags/:tag', catchErrors(getStoresByTag))

router.post('/register', validateRegister, catchErrors(register))

router.post('/login', validateLogIn, catchErrors(login))


export { router };